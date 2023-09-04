"use client";

import { FC } from "react";
import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

type SocketIndicatorProps = {}

const SocketIndicator: FC<SocketIndicatorProps> = ({}) => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant={"outline"}
        className="border-none bg-yellow-600 text-white"
      >
        Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge
      variant={"outline"}
      className="border-none bg-emerald-600 text-white"
    >
      Live updates
    </Badge>
  );
};

export default SocketIndicator;
