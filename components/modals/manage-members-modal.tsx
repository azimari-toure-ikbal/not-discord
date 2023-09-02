"use client";

import qs from "query-string";
import { FC, useState } from "react";

import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

const ManageMembersModal: FC = ({}) => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data, members, profiles } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const { server } = data;
  const isModalOpen = isOpen && type === "members";

  const onKick = async (profileId: string) => {
    try {
      setLoadingId(profileId);
      const url = qs.stringifyUrl({
        url: `/api/members/${profileId}`,
        query: { serverId: server?.id },
      });
      const response = await axios.delete(url);
      router.refresh();
      onOpen(
        "members",
        { server },
        response.data.members,
        response.data.profiles,
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (
    profileId: string,
    role: "GUEST" | "ADMIN" | "MODERATOR",
  ) => {
    try {
      setLoadingId(profileId);
      const url = qs.stringifyUrl({
        url: `/api/members/${profileId}`,
        query: { serverId: server?.id },
      });

      const response = await axios.patch(url, { role });

      router.refresh();
      onOpen(
        "members",
        { server },
        response.data.members,
        response.data.profiles,
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {members?.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {profiles?.map((profile) => (
            <div key={profile.id} className="mb-6 flex items-center gap-x-2">
              <UserAvatar src={profile.imageUrl!} />
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-1 text-xs font-semibold">
                  {profile.name}
                  {
                    roleIconMap[
                      members.find((member) => member.profileId === profile.id)
                        ?.role!
                    ]
                  }
                </div>
                <p className="text-xs text-zinc-500">{profile.email}</p>
              </div>
              {server?.profileId !== profile.id && loadingId !== profile.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="mr-2 h-4 w-4" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(profile.id, "GUEST")}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Guest
                              {members.find(
                                (member) => member.profileId === profile.id,
                              )?.role === "GUEST" && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                onRoleChange(profile.id, "MODERATOR")
                              }
                            >
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Moderator
                              {members.find(
                                (member) => member.profileId === profile.id,
                              )?.role === "MODERATOR" && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator>
                        <DropdownMenuItem onClick={() => onKick(profile.id)}>
                          <Gavel className="mr-2 h-4 w-4" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuSeparator>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === profile.id && (
                <Loader2 className="ml-auto h-4 w-4 animate-spin text-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembersModal;
