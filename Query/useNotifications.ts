import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const NOTIFICATIONS_KEY = ["notifications"] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: "like" | "follow" | "comment" | "message";
  message: string;
  is_read: boolean;
  created_at: string;
  post_id: string | null;
  sender_id: string;
  sender_name: string;
  sender_image: string | null;
}

interface NotificationsResponse {
  success: boolean;
  notifications: AppNotification[];
  unread: number;
  total: number;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useNotifications = () => {
  return useQuery<NotificationsResponse>({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: async () => {
      const { data } = await api.get("/api/notifications");
      return data;
    },
    staleTime: 30 * 1000,
  });
};

export const useUnreadCount = () => {
  return useQuery<NotificationsResponse, Error, number>({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: async () => {
      const { data } = await api.get("/api/notifications");
      return data;
    },
    staleTime: 30 * 1000,
    select: (data) => data.unread, // ✅ الـ backend بيحسبها جاهزة
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await api.put(
        `/api/notifications/${notificationId}/read`,
      );
      return data;
    },
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous =
        queryClient.getQueryData<NotificationsResponse>(NOTIFICATIONS_KEY);

      queryClient.setQueryData<NotificationsResponse>(
        NOTIFICATIONS_KEY,
        (old) => {
          if (!old) return old;
          const updated = old.notifications.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n,
          );
          return {
            ...old,
            notifications: updated,
            unread: updated.filter((n) => !n.is_read).length,
          };
        },
      );

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(NOTIFICATIONS_KEY, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.put("/api/notifications/read-all");
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous =
        queryClient.getQueryData<NotificationsResponse>(NOTIFICATIONS_KEY);

      queryClient.setQueryData<NotificationsResponse>(
        NOTIFICATIONS_KEY,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            notifications: old.notifications.map((n) => ({
              ...n,
              is_read: true,
            })),
            unread: 0, // ✅ مش محتاج تحسب — صفر مباشرة
          };
        },
      );

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(NOTIFICATIONS_KEY, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await api.delete(`/api/notifications/${notificationId}`);
      return data;
    },
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous =
        queryClient.getQueryData<NotificationsResponse>(NOTIFICATIONS_KEY);

      queryClient.setQueryData<NotificationsResponse>(
        NOTIFICATIONS_KEY,
        (old) => {
          if (!old) return old;
          const updated = old.notifications.filter(
            (n) => n.id !== notificationId,
          );
          return {
            ...old,
            notifications: updated,
            unread: updated.filter((n) => !n.is_read).length,
            total: old.total - 1,
          };
        },
      );

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(NOTIFICATIONS_KEY, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });
};
