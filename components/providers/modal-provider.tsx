"use client";

import { FC, useEffect, useState } from "react";
import CreateChannelModal from "../modals/create-channel-modal";
import CreateServerModal from "../modals/create-server-modal";
import DeleteChannelModal from "../modals/delete-channel-modal";
import DeleteServerModal from "../modals/delete-server-modal";
import EditChannelModal from "../modals/edit-channel-modal";
import EditServerModal from "../modals/edit-server-modal";
import InviteModal from "../modals/invite-modal";
import LeaveServerModal from "../modals/leave-server-modal";
import ManageMembersModal from "../modals/manage-members-modal";
import MessageFileModal from "../modals/message-file-modal ";
import DeleteMessageModal from "../modals/delete-message-modal";

const ModalProvider: FC = ({}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <ManageMembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <DeleteMessageModal />
      <EditChannelModal />
      <MessageFileModal />
    </>
  );
};

export default ModalProvider;
