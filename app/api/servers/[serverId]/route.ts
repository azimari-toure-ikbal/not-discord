import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { channel, member, server } from "@/lib/drizzle/schema/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { serverId: string };
  },
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedServer = await db
      .update(server)
      .set({
        name,
        imageUrl,
      })
      .where(
        and(eq(server.id, params.serverId), eq(server.profileId, profile.id)),
        // eq(server.id, params.serverId)
      );

    // console.log(updatedServer);

    const selectNewlyUpdatedServer = await db.query.servers.findFirst({
      where: eq(server.id, params.serverId),
    });

    // console.log(selectNewlyUpdatedServer);
    return NextResponse.json(selectNewlyUpdatedServer);
  } catch (error) {
    console.error(
      `Error in PATCH /api/servers/${params.serverId}/route.ts: ${error}`,
    );
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { serverId: string };
  },
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedServer = await db
      .delete(server)
      .where(
        and(eq(server.id, params.serverId), eq(server.profileId, profile.id)),
      );

    // Delete all the members and the channel of the server
    await db.delete(channel).where(eq(channel.serverId, params.serverId));

    await db.delete(member).where(eq(member.serverId, params.serverId));

    const servers = await db.query.servers.findFirst({
      where: eq(server.profileId, profile.id),
    });

    return NextResponse.json(servers);
  } catch (error) {
    console.error(
      `Error in PATCH /api/servers/${params.serverId}/route.ts: ${error}`,
    );
    return new NextResponse("Internal server error", { status: 500 });
  }
}
