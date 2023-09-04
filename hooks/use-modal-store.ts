import {
  Channel,
  ChannelType,
  Member,
  Profile,
  Server,
} from "@/lib/drizzle/schema/schema";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage";

type ModalData = {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: Record<string, any>;
};

type ModalStore = {
  type: ModalType | null;
  data: ModalData;
  profiles: Profile[];
  members: Member[];
  isOpen: boolean;
  onOpen: (
    type: ModalType,
    data?: ModalData,
    members?: Member[],
    profiles?: Profile[],
  ) => void;
  onClose: () => void;
};

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  members: [],
  profiles: [],
  isOpen: false,
  onOpen: (type, data = {}, members = [], profiles = []) =>
    set({ type, isOpen: true, data, members, profiles }),
  onClose: () => set({ type: null, isOpen: false }),
}));
