import { useEffect } from "react";
import socket from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { messagesKey, CONVERSATIONS_KEY } from "@/Query/useChat";
import { Message } from "@/Query/useChat";

export const useChatSocket = (conversationId: number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    const joinAndListen = () => {
      socket.emit("join_conversation", conversationId);
    };

    // ✅ لو connected خش على طول، لو لا استنى الـ connect
    if (socket.connected) {
      joinAndListen();
    } else {
      socket.on("connect", joinAndListen);
    }

    const handleNewMessage = (message: Message) => {
      queryClient.setQueryData<Message[]>(
        messagesKey(conversationId),
        (old) => [...(old ?? []), message],
      );
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("connect", joinAndListen);
      socket.off("new_message", handleNewMessage);
    };
  }, [conversationId, queryClient]);
};
