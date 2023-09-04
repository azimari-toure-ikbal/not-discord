import { and, eq } from "drizzle-orm";
import { db } from "./drizzle/db";
import { conversation } from "./drizzle/schema/schema";
import { generateUUID } from "./utils";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation) {
    conversation = await createConversation(memberOneId, memberTwoId);
  }

  return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.query.conversations.findFirst({
      where: and(
        eq(conversation.memberOneId, memberOneId),
        eq(conversation.memberTwoId, memberTwoId),
      ),
    });
  } catch {
    return null;
  }
};

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const convoId = generateUUID();
    await db.insert(conversation).values({
      id: convoId,
      memberOneId,
      memberTwoId,
    });

    return await db.query.conversations.findFirst({
      where: eq(conversation.id, convoId),
    });
  } catch {
    return null;
  }
};
