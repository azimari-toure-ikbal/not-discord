import ServerSidebar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { member } from "@/lib/drizzle/schema/schema";
import { redirectToSignIn } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  // const foundServer = await db.query.servers.findFirst({
  //   where: and(eq(server.id, params.serverId)),
  // });

  const isMember = await db.query.members.findFirst({
    where: and(
      eq(member.serverId, params.serverId),
      eq(member.profileId, profile.id),
    ),
  });

  // console.log("foundserver", foundServer);
  if (!isMember) {
    return redirect(`/`);
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
