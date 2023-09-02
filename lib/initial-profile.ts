import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { db } from "./drizzle/db";
import { profile } from "./drizzle/schema/schema";
import { generateUUID } from "./utils";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) return redirectToSignIn();

  const findUser = await db.query.profiles.findFirst({
    where: eq(profile.userId, user.id),
  });

  if (findUser) return findUser;

  const newUser = await db.insert(profile).values({
    id: generateUUID(),
    userId: user.id,
    name: `${user.firstName} ${user.lastName}`,
    imageUrl: user.imageUrl,
    email: user.emailAddresses[0].emailAddress,
  });

  const userNewlyCreated = await db.query.profiles.findFirst({
    where: eq(profile.userId, user.id),
  });

  return userNewlyCreated;
};
