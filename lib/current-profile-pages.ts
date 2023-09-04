import { getAuth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextApiRequest } from "next";
import { db } from "./drizzle/db";
import { profile } from "./drizzle/schema/schema";

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const currentProfile = await db.query.profiles.findFirst({
    where: eq(profile.userId, userId),
  });

  return currentProfile;
};
