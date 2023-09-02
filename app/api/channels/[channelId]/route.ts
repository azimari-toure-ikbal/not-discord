import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { channel } from "@/lib/drizzle/schema/schema";
import { and, eq, not } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { channelId: string };
  },
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const updatedChannel = await db
      .update(channel)
      .set({
        name,
        type,
      })
      .where(
        and(
          and(
            eq(channel.serverId, serverId),
            eq(channel.profileId, profile.id),
            eq(channel.id, params.channelId),
          ),
          not(eq(channel.name, "general")),
        ),
      );

    // const updatedServer = await db
    //   .update(server)
    //   .set({
    //     name,
    //     imageUrl,
    //   })
    //   .where(
    //     and(eq(server.id, params.serverId), eq(server.profileId, profile.id)),
    //     // eq(server.id, params.serverId)
    //   );

    // // console.log(updatedServer);

    // const selectNewlyUpdatedServer = await db.query.servers.findFirst({
    //   where: eq(server.id, params.serverId),
    // });

    // // console.log(selectNewlyUpdatedServer);
    // return NextResponse.json(selectNewlyUpdatedServer);
    return NextResponse.json(updatedChannel);
  } catch (error) {
    console.error("Error in PATCH /api/channels/[channelId]route.ts: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } },
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    console.log("serverId: ", serverId);
    console.log("profile.id: ", profile.id);

    const deletedChannel = await db
      .delete(channel)
      .where(
        and(
          and(
            eq(channel.serverId, serverId),
            eq(channel.profileId, profile.id),
            eq(channel.id, params.channelId),
          ),
          not(eq(channel.name, "general")),
        ),
      );

    return NextResponse.json(deletedChannel);
  } catch (error) {
    console.error("Error in DELETE /api/channels/[channelId]route.ts: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
