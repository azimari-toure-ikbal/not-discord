import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { member, server } from "@/lib/drizzle/schema/schema";
import { generateUUID } from "@/lib/utils";
import { redirectToSignIn } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { FC } from "react";

type InviteCodeProps = {
  params: {
    inviteCode: string;
  };
};

const InviteCode: FC<InviteCodeProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const serverToBeJoined = await db.query.servers.findFirst({
    where: eq(server.inviteCode, params.inviteCode),
  });

  console.log(serverToBeJoined);
  if (!serverToBeJoined) {
    return redirect("/");
  }

  const alreadyJoined = await db.query.members.findFirst({
    where: and(
      eq(member.serverId, serverToBeJoined?.id),
      eq(member.profileId, profile.id),
    ),
  });

  if (alreadyJoined) {
    console.log("Redirection 12");
    return redirect(`/servers/${alreadyJoined.serverId}`);
  }

  const joinServer = await db.insert(member).values({
    id: generateUUID(),
    profileId: profile.id,
    serverId: serverToBeJoined.id,
  });

  if (joinServer) {
    console.log("Redirection 13");
    return redirect(`/servers/${serverToBeJoined?.id}`);
  }

  return null;
};

export default InviteCode;
