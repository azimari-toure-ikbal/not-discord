import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { member, server } from "@/lib/drizzle/schema/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      serverId: string;
    };
  },
) {
  try {
    const profile = await currentProfile();
    console.log("profile", profile);

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const memberLeaving = await db
      .delete(member)
      .where(
        and(
          eq(member.serverId, params.serverId),
          eq(member.profileId, profile.id),
        ),
      );

    const servers = await db.query.servers.findFirst({
      where: eq(server.profileId, profile.id),
    });

    // console.log("servers", servers);

    return NextResponse.json(servers);
  } catch (error) {
    console.error(
      `Error in PATCH /api/servers/[{server?.id}]/leave.route.ts: ${error}`,
    );
    return new NextResponse("Internal server error", { status: 500 });
  }
}
