import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { channel, server } from "@/lib/drizzle/schema/schema";
import { redirectToSignIn } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { FC } from "react";

type ServerIdPageProps = {
  params: {
    serverId: string;
  };
};

const ServerIdPage: FC<ServerIdPageProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const foundServer = await db.query.servers.findFirst({
    where: eq(server.id, params.serverId),
  });

  if (!foundServer) {
    return redirect("/");
  }

  const serverChannels = await db.query.channels.findMany({
    where: and(
      eq(channel.serverId, foundServer.id),
      eq(channel.name, "general"),
    ),
    orderBy: (channels, { asc }) => [asc(channels.createdAt)],
  });

  // console.log(serverChannels);
  const initialChannel = serverChannels[0];

  if (initialChannel.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`);
};

export default ServerIdPage;
