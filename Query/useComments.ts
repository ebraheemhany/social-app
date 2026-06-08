import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { POSTS_KEY } from "./useGetAllPosts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  username: string;
  profile_image: string | null;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

export const commentsKey = (postId: number) => ["comments", postId] as const;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useGetComments = (postId: number) => {
  return useQuery<Comment[]>({
    queryKey: commentsKey(postId),
    queryFn: async () => {
      const { data } = await api.get(`/api/posts/${postId}/comments`);
      return data.comments;
    },
    enabled: !!postId,
    staleTime: 30 * 1000,
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const { data } = await api.post(`/api/posts/${postId}/comments`, {
        content,
      });
      return data.comment as Comment;
    },
    onSuccess: (newComment) => {
      // ✅ أضف الـ comment للـ cache مباشرة من غير refetch
      queryClient.setQueryData<Comment[]>(commentsKey(postId), (old) => [
        newComment,
        ...(old ?? []),
      ]);
      // ✅ حدّث الـ comments_count في قائمة الـ posts
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
  });
};

export const useEditComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      const { data } = await api.put(`/api/comments/${commentId}`, {
        content,
      });
      return data.result;
    },
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey: commentsKey(postId) });
      const previous = queryClient.getQueryData<Comment[]>(commentsKey(postId));

      // ✅ Optimistic update
      queryClient.setQueryData<Comment[]>(commentsKey(postId), (old) =>
        (old ?? []).map((c) => (c.id === commentId ? { ...c, content } : c)),
      );

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(commentsKey(postId), ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey(postId) });
    },
  });
};

export const useDeleteComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      const { data } = await api.delete(`/api/comments/${commentId}`);
      return data;
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: commentsKey(postId) });
      const previous = queryClient.getQueryData<Comment[]>(commentsKey(postId));

      // ✅ Optimistic delete
      queryClient.setQueryData<Comment[]>(commentsKey(postId), (old) =>
        (old ?? []).filter((c) => c.id !== commentId),
      );

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(commentsKey(postId), ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey(postId) });
      // ✅ حدّث الـ comments_count في قائمة الـ posts
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
  });
};
