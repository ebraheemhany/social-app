import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Conversation {
  id: number;
  last_message: string | null;
  last_message_at: string | null;
  other_user_id: number;
  other_username: string;
  other_profile_image: string | null;
  unread_count: number;
}

export interface Message {
  id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_id: number;
  sender_name: string;
  sender_image: string | null;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

export const CONVERSATIONS_KEY = ["conversations"] as const;
export const messagesKey = (conversationId: number) =>
  ["messages", conversationId] as const;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useConversations = () => {
  return useQuery<Conversation[]>({
    queryKey: CONVERSATIONS_KEY,
    queryFn: async () => {
      const { data } = await api.get("/api/conversations");
      return data.conversations;
    },
    staleTime: 0,
  });
};

export const useMessages = (conversationId: number) => {
  return useQuery<Message[]>({
    queryKey: messagesKey(conversationId),
    queryFn: async () => {
      const { data } = await api.get(
        `/api/conversations/${conversationId}/messages`,
      );
      return data.messages;
    },
    enabled: !!conversationId,
    staleTime: 0, // ✅ الرسايل دايماً fresh
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useGetOrCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const { data } = await api.post(`/api/conversations/${userId}`);
      return data.conversation as Conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
  });
};

export const useSendMessage = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const { data } = await api.post(
        `/api/conversations/${conversationId}/messages`,
        { content },
      );
      return data.message as Message;
    },
    onMutate: async (content) => {
      await queryClient.cancelQueries({
        queryKey: messagesKey(conversationId),
      });
      const previous = queryClient.getQueryData<Message[]>(
        messagesKey(conversationId),
      );

      // ✅ Optimistic message مؤقت
      const optimistic: Message = {
        id: Date.now(), // temp id
        content,
        is_read: false,
        created_at: new Date().toISOString(),
        sender_id: -1, // سيتبدل بعد الـ invalidate
        sender_name: "",
        sender_image: null,
      };

      queryClient.setQueryData<Message[]>(
        messagesKey(conversationId),
        (old) => [...(old ?? []), optimistic],
      );

      return { previous };
    },
    onError: (_err, _content, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(messagesKey(conversationId), ctx.previous);
    },
    onSettled: () => {
      // ✅ استبدل الـ optimistic بالـ real message من الـ server
      queryClient.invalidateQueries({ queryKey: messagesKey(conversationId) });
      // ✅ حدّث آخر رسالة في قائمة المحادثات
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
  });
};

export const useDeleteMessage = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: number) => {
      const { data } = await api.delete(`/api/messages/${messageId}`);
      return data;
    },
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({
        queryKey: messagesKey(conversationId),
      });
      const previous = queryClient.getQueryData<Message[]>(
        messagesKey(conversationId),
      );

      queryClient.setQueryData<Message[]>(messagesKey(conversationId), (old) =>
        (old ?? []).filter((m) => m.id !== messageId),
      );

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(messagesKey(conversationId), ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: messagesKey(conversationId) });
    },
  });
};
