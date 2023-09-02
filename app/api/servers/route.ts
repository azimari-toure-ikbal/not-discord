import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { channel, member, server } from "@/lib/drizzle/schema/schema";
import { generateUUID } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const serverUUID = generateUUID();
    console.log("serverUUID old: ", serverUUID);

    const newServer = await db.insert(server).values({
      id: serverUUID,
      name,
      imageUrl,
      profileId: profile.id,
      inviteCode: generateUUID(),
    });

    const serverChannel = await db.insert(channel).values({
      id: generateUUID(),
      name: "general",
      type: "TEXT",
      serverId: serverUUID,
      profileId: profile.id,
    });

    const serverMembers = await db.insert(member).values({
      id: generateUUID(),
      serverId: serverUUID,
      profileId: profile.id,
      role: "ADMIN",
    });

    console.log("serverUUID new: ", serverUUID);

    return NextResponse.json(newServer);
  } catch (error) {
    console.error("Error in POST /api/servers/route.ts: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
