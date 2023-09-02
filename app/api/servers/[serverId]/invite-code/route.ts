import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { server } from "@/lib/drizzle/schema/schema";
import { generateUUID } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  const newInviteCode = generateUUID();
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    const updatedServer = await db
      .update(server)
      .set({
        inviteCode: newInviteCode,
      })
      .where(
        and(eq(server.id, params.serverId), eq(server.profileId, profile.id)),
      );

    const selectNewlyUpdatedServer = await db.query.servers.findFirst({
      where: eq(server.inviteCode, newInviteCode),
    });

    return NextResponse.json(selectNewlyUpdatedServer);
  } catch (error) {
    console.error(
      `Error in PATCH /api/servers/${params.serverId}/invite-code/route.ts: ${error}`,
    );
    return new NextResponse("Internal server error", { status: 500 });
  }
}
