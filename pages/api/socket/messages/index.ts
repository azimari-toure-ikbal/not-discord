import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/drizzle/db";
import { channel, member, message, server } from "@/lib/drizzle/schema/schema";
import { generateUUID } from "@/lib/utils";
import { NextApiResponseServerIo } from "@/type";
import { and, eq } from "drizzle-orm";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Missing serverId" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Missing channelId" });
    }

    if (!content && !fileUrl) {
      return res.status(400).json({ error: "Missing content or fileUrl" });
    }

    const foundServer = await db.query.servers.findFirst({
      where: eq(server.id, serverId as string),
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

    const newMessage = await db.insert(message).values({
      id: generateUUID(),
      content,
      fileUrl,
      channelId: channelId as string,
      profileId: profile.id,
      serverId: serverId as string,
      memberId: memberToFind.id,
    });

    const selectNewMessage = await db.query.messages.findFirst({
      where: eq(message.id, newMessage.insertId),
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, newMessage);

    return res.status(200).json(selectNewMessage);
  } catch (error) {
    console.error("Error in POST pages/api/socket/messages.ts: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
