"use client";

import { FC, useState } from "react";

import axios from "axios";
import qs from "query-string";

import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const DeleteMessageModal: FC = ({}) => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const { apiUrl, query } = data;

  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "deleteMessage";

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      console.log(url);

      const response = await axios.delete(url);

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            You done f up uuh ? <br />
            The message will be permanently deleted or something like that.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isLoading} onClick={onClose} variant={"ghost"}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleClick}
              variant={"primary"}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
