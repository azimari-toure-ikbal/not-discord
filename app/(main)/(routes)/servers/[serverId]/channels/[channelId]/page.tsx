import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { ChannelType, channel, member } from "@/lib/drizzle/schema/schema";
import { redirectToSignIn } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { FC } from "react";

type ChannelIdPageProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};

const ChannelIdPage: FC<ChannelIdPageProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channelToFind = await db.query.channels.findFirst({
    where: eq(channel.id, params.channelId),
  });

  const members = await db.query.members.findMany({
    where: eq(member.serverId, params.serverId),
  });

  const profiles = await db.query.profiles.findMany();

  const memberToFind = await db.query.members.findFirst({
    where: and(
      eq(member.profileId, profile.id),
      eq(member.serverId, params.serverId),
    ),
  });

  if (!channelToFind || !memberToFind) {
    return redirect(`/`);
  }

  return (
    <div className="flex h-screen flex-1 flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        name={channelToFind.name}
        serverId={channelToFind.serverId!}
        type="channel"
      />
      {channelToFind?.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={memberToFind}
            serverMembers={members}
            profileMembers={profiles}
            name={channelToFind.name}
            chatId={channelToFind.id}
            type={"channel"}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channelToFind.id,
              serverId: channelToFind.serverId!,
            }}
            paramKey="channelId"
            paramValue={channelToFind.id}
          />
          <ChatInput
            name={channelToFind.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channelToFind.id,
              serverId: channelToFind.serverId,
            }}
          />
        </>
      )}
      {channelToFind?.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channelToFind.id} audio={true} video={false} />
      )}
      {channelToFind?.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channelToFind.id} audio={false} video={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;
