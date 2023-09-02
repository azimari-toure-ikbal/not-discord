import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { member, server } from "@/lib/drizzle/schema/schema";
import { UserButton } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { FC } from "react";
import { ModeToggle } from "../mode-toggle";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import NavigationAction from "./navigation-action";
import NavigationItem from "./navigation-item";

const NavigationSidebar: FC = async ({}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/setup");
  }

  const members = await db.query.members.findMany({
    where: eq(member.profileId, profile.id),
  });

  const servers = await db.query.servers.findMany({
    where: eq(member.profileId, profile.id),
  });

  // Filter out servers that the user is a member of
  const filteredServers = members
    .filter((member) => {
      return servers.filter((server) => server.id === member.serverId);
    })
    .map(async (x) => {
      return await db.query.servers.findFirst({
        where: eq(server.id, x.serverId!),
      });
    });

  let serversArray;

  try {
    serversArray = await Promise.all(filteredServers);
  } catch (error) {
    console.error("Erreur lors de la récupération des serveurs :", error);
  }

  // console.log(serversArray);

  return (
    <div className="flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 text-primary dark:bg-[#1E1F22]">
      <NavigationAction />
      <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
      <ScrollArea className="w-full flex-1">
        {serversArray &&
          serversArray.map((server) => (
            <div key={server!.id} className="mb-4">
              <NavigationItem
                id={server?.id!}
                imageUrl={server!.imageUrl}
                name={server!.name}
              />
            </div>
          ))}
      </ScrollArea>
      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[42px] w-[42px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
