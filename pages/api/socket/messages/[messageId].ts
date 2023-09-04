import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/drizzle/db";
import {
  Role,
  channel,
  member,
  message,
  server,
} from "@/lib/drizzle/schema/schema";
import { NextApiResponseServerIo } from "@/type";
import { and, eq, sql } from "drizzle-orm";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Missing serverId" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Missing channelId" });
    }

    if (!messageId) {
      return res.status(400).json({ error: "Missing messageId" });
    }

    const foundServer = await db.query.servers.findFirst({
      where: and(eq(server.id, serverId as string)),
    });

    if (!foundServer) {
      return res.status(404).json({ error: "Server not found" });
    }

    const foundChannel = await db.query.channels.findFirst({
      where: and(
        eq(channel.serverId, serverId as string),
        eq(channel.id, channelId as string),
      ),
    });

    if (!foundChannel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const memberToFind = await db.query.members.findFirst({
      where: and(
        eq(member.serverId, serverId as string),
        eq(member.profileId, profile.id),
      ),
    });

    if (!memberToFind) {
      return res.status(404).json({ error: "Member not found" });
    }

    let messageToFind = null;

    messageToFind = await db.query.messages.findFirst({
      where: and(
        eq(message.id, messageId as string),
        eq(message.channelId, channelId as string),
      ),
    });

    if (!messageToFind || messageToFind.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = messageToFind.memberId === memberToFind.id;
    const isAdmin = memberToFind.role === Role.ADMIN;
    const isModerator = memberToFind.role === Role.MODERATOR;
    const canModify = isAdmin || isModerator || isMessageOwner;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      messageToFind = await db
        .update(message)
        .set({
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
          // updatedAt: sql`now()`,
        })
        .where(eq(message.id, messageId as string));
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      messageToFind = await db
        .update(message)
        .set({
          content,
          updatedAt: sql`now()`,
        })
        .where(eq(message.id, messageId as string));
    }

    messageToFind = await db.query.messages.findFirst({
      where: and(
        eq(message.id, messageId as string),
        eq(message.channelId, channelId as string),
      ),
    });

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, messageToFind);

    return res.status(200).json(messageToFind);
  } catch (error) {
    console.error("Error in pages/api/socket/messages.ts: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
