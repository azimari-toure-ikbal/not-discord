import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { Message, message } from "@/lib/drizzle/schema/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.query.messages.findMany({
        where: eq(message.channelId, channelId),
        orderBy: [desc(message.createdAt)],
      });

      // cursor pagination with MESSAGES_BATCH
      messages = messages.slice(
        messages.findIndex((m) => m.id === cursor) + 1,
        messages.findIndex((m) => m.id === cursor) + MESSAGES_BATCH + 1,
      );
    } else {
      messages = await db.query.messages.findMany({
        where: eq(message.channelId, channelId),
        orderBy: [desc(message.createdAt)],
      });

      // pagination only with MESSAGES_BATCH
      messages = messages.slice(0, MESSAGES_BATCH);
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.error("Error in GET /api/messages/route.ts: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
