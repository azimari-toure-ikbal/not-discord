import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { channel, member } from "@/lib/drizzle/schema/schema";
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

  const test = await db.query.servers.findFirst({
    with: {
      channels: true,
    },
  });

  console.log(test);

  const channelToFind = await db.query.channels.findFirst({
    where: eq(channel.id, params.channelId),
  });

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
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        name={channelToFind.name}
        serverId={channelToFind.serverId!}
        type="channel"
      />
    </div>
  );
};

export default ChannelIdPage;
