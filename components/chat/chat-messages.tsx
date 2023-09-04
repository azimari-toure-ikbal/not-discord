"use client";

import { useChatQuery } from "@/hooks/use-chat-query";

import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { Member, Message, Profile } from "@/lib/drizzle/schema/schema";
import { formatDate } from "@/lib/utils";
import { Loader2, ServerCrash } from "lucide-react";
import { ElementRef, FC, Fragment, useRef } from "react";
import ChatItem from "./chat-item";
import ChatWelcome from "./chat-welcome";

type ChatMessagesProps = {
  name: string;
  member: Member;
  serverMembers: Member[];
  profileMembers: Profile[];
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
};

const DATE_FORMAT = "d MMM yyyy HH:mm";

const ChatMessages: FC<ChatMessagesProps> = ({
  apiUrl,
  chatId,
  member,
  serverMembers,
  profileMembers,
  name,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });
  //   console.log(data?.pages);
  if (status === "loading") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Oops something went wrong...
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto py-4">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="my-4 h-6 w-6 animate-spin text-zinc-500" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="my-4 text-xs text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="mt-auto flex flex-col-reverse">
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group.items.map((message: Message) => (
              <>
                <ChatItem
                  key={message.id}
                  id={message.id}
                  currentMember={member}
                  member={
                    serverMembers.find(
                      (serverMember) => serverMember.id === message.memberId,
                    )!
                  }
                  profile={
                    profileMembers.find(
                      (profileMember) => profileMember.id === message.profileId,
                    )!
                  }
                  content={message.content!}
                  fileUrl={message.fileUrl}
                  deleted={message.deleted!}
                  timestamp={formatDate(new Date(message.createdAt!))}
                  isUpdated={message.updatedAt !== null}
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                />
              </>
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
