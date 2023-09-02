import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { channel } from "@/lib/drizzle/schema/schema";
import { generateUUID } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

    if (name === "general") {
      return new NextResponse("Channel name cannot be general", {
        status: 400,
      });
    }

    const createdChannel = await db.insert(channel).values({
      id: generateUUID(),
      name,
      type,
      profileId: profile.id,
      serverId,
    });

    return NextResponse.json(createdChannel);
  } catch (error) {
    console.error("Error in POST /api/channels/route.ts: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
