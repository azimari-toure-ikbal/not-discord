import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import {
  ChannelType,
  Role,
  channel,
  member,
  server,
} from "@/lib/drizzle/schema/schema";
import { asc, eq } from "drizzle-orm";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { redirect } from "next/navigation";
import { FC } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import ServerChannel from "./server-channel";
import ServerHeader from "./server-header";
import ServerMember from "./server-member";
import ServerSearch from "./server-search";
import ServerSection from "./server-section";

type ServerSidebarProps = {
  serverId: string;
};

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [Role.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
  [Role.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
  [Role.GUEST]: null,
};

const ServerSidebar: FC<ServerSidebarProps> = async ({ serverId }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const foundServer = await db.query.servers.findFirst({
    where: eq(server.id, serverId),
  });

  const serverMembers = await db.query.members.findMany({
    where: eq(member.serverId, serverId),
    orderBy: [asc(member.role)],
  });

  const serverChannels = await db.query.channels.findMany({
    where: eq(channel.serverId, serverId),
    orderBy: (channels, { asc }) => [asc(channels.createdAt)],
  });

  const textChannels = serverChannels.filter(
    (channel) => channel.type === "TEXT",
  );
  const audioChannels = serverChannels.filter(
    (channel) => channel.type === "AUDIO",
  );
  const videoChannels = serverChannels.filter(
    (channel) => channel.type === "VIDEO",
  );
  const members = serverMembers.filter(
    (member) => member.profileId !== profile.id,
  );
  // Get all profiles in the server that
  const allProfiles = await db.query.profiles.findMany();

  const allProfilesInServer = allProfiles.filter((profile) =>
    serverMembers.find((member) => member.profileId === profile.id),
  );

  const allProfilesInServerWithoutCurrentlyLoggedInUser =
    allProfilesInServer.filter((loggedIn) => loggedIn.id !== profile.id);

  if (!foundServer) {
    return redirect("/");
  }

  const role = serverMembers.find((member) => member.profileId === profile.id)
    ?.role!!;

  return (
    <div className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
      <ServerHeader
        profiles={allProfilesInServer}
        members={serverMembers}
        server={foundServer}
        role={role as Role}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type!],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type!],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type!],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: allProfilesInServerWithoutCurrentlyLoggedInUser?.map(
                  (profile) => ({
                    id: profile.id,
                    name: profile.name,
                    icon: roleIconMap[
                      profile.id === foundServer.profileId
                        ? "ADMIN"
                        : "MODERATOR"
                    ],
                  }),
                ),
              },
            ]}
          />
        </div>
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role as Role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={foundServer}
                  role={role as Role}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role as Role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={foundServer}
                  role={role as Role}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role as Role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={foundServer}
                  role={role as Role}
                />
              ))}
            </div>
          </div>
        )}
        {!!allProfilesInServerWithoutCurrentlyLoggedInUser?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role as Role}
              label="Members"
              profiles={allProfilesInServer}
              members={serverMembers}
              server={foundServer}
            />
            <div className="space-y-[2px]">
              {allProfilesInServerWithoutCurrentlyLoggedInUser.map((member) => (
                <ServerMember
                  key={member.id}
                  member={members.find((m) => m.profileId === member.id)!!}
                  profile={member}
                  server={foundServer}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
