import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { db } from "./drizzle/db";
import { profile } from "./drizzle/schema/schema";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const currentProfile = await db.query.profiles.findFirst({
    where: eq(profile.userId, userId),
  });

  return currentProfile;
};
