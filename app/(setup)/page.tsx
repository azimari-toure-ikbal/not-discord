import InitialModal from "@/components/modals/initial-modal";
import { db } from "@/lib/drizzle/db";
import { member } from "@/lib/drizzle/schema/schema";
import { initialProfile } from "@/lib/initial-profile";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const SetupPage = async ({}) => {
  const profile = await initialProfile();

  const server = await db.query.servers.findFirst({
    where: eq(member.profileId, profile.id),
  });

  console.log("server", server);
  if (server) return redirect(`/servers/${server.id}`);

  return <InitialModal />;
};

export default SetupPage;
