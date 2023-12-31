"use client";

import { useModal } from "@/hooks/use-modal-store";
import {
  ChannelType,
  Member,
  Profile,
  Role,
  Server,
} from "@/lib/drizzle/schema/schema";
import { Plus, Settings } from "lucide-react";
import { FC } from "react";
import ActionTooltip from "../action-tooltip";

type ServerSectionProps = {
  label: string;
  role?: Role;
  sectionType: "members" | "channels";
  channelType?: ChannelType;
  server?: Server;
  members?: Member[];
  profiles?: Profile[];
};

const ServerSection: FC<ServerSectionProps> = ({
  label,
  sectionType,
  channelType,
  members,
  profiles,
  role,
  server,
}) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== Role.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === Role.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", { server }, members, profiles)}
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
