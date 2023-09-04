"use client";

import { Member, Profile, Role, Server } from "@/lib/drizzle/schema/schema";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "../user-avatar";

type ServerMemberProps = {
  member: Member;
  profile: Profile;
  server: Server;
};

const roleIconMap = {
  [Role.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
  [Role.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
  [Role.GUEST]: null,
};

const ServerMember: FC<ServerMemberProps> = ({ member, profile, server }) => {
  const router = useRouter();
  const params = useParams();

  const icon = roleIconMap[member.role!];

  const handleClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        `group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50`,
        params?.memberId === member.id && `bg-zinc-700/20 dark:bg-zinc-700`,
      )}
    >
      <UserAvatar src={profile.imageUrl!} className="h-8 w-8 md:h-8 md:w-8" />
      <p
        className={cn(
          `text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300`,
          params?.memberId === member.id &&
            `text-primary dark:text-zinc-200 dark:group-hover:text-white`,
        )}
      >
        {profile.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMember;
