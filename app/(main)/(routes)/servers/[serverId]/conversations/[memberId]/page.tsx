import ChatHeader from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { member } from "@/lib/drizzle/schema/schema";
import { redirectToSignIn } from "@clerk/nextjs";
import { and, asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { FC } from "react";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const MemberIdPage: FC<MemberIdPageProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.query.members.findFirst({
    where: and(
      eq(member.profileId, profile.id),
      eq(member.serverId, params.serverId),
    ),
  });

  if (!currentMember) {
    return redirect(`/`);
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId,
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOneId, memberTwoId } = conversation;
  const otherMember = memberOneId === profile.id ? memberTwoId : memberOneId;

  const serverMembers = await db.query.members.findMany({
    where: eq(member.serverId, params.serverId),
    orderBy: [asc(member.role)],
  });

  const allProfiles = await db.query.profiles.findMany();

  // Get the profile of the other member from serverMembers and allProfiles
  const otherMemberProfile = serverMembers.find(
    (member) => member.id !== otherMember,
  )?.profileId;

  const otherMemberProfileData = allProfiles.find(
    (profile) => profile.id === otherMemberProfile,
  );

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        name={otherMemberProfileData?.name!}
        imageUrl={otherMemberProfileData?.imageUrl!}
        type="conversation"
        serverId={params.serverId}
      />
    </div>
  );
};

export default MemberIdPage;
