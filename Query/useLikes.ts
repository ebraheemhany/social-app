import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { POSTS_KEY } from "./useGetAllPosts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LikeUser {
  id: number;
  username: string;
  profile_image: string | null;
}

export interface PostLikes {
  count: number;
  users: LikeUser[];
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

export const likesKey = (postId: number) => ["likes", postId] as const;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useGetPostLikes = (postId: number) => {
  return useQuery<PostLikes>({
    queryKey: likesKey(postId),
    queryFn: async () => {
      const { data } = await api.get(`/api/posts/${postId}/likes`);
      return data;
    },
    enabled: !!postId,
    staleTime: 30 * 1000,
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useToggleLike = (postId: number, currentUserId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/api/posts/${postId}/like`);
      return data as { message: string; liked: boolean; count: number };
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: likesKey(postId) });
      const previous = queryClient.getQueryData<PostLikes>(likesKey(postId));

      // ✅ Optimistic toggle
      queryClient.setQueryData<PostLikes>(likesKey(postId), (old) => {
        if (!old) return old;
        const alreadyLiked = old.users.some((u) => u.id === currentUserId);

        return {
          count: alreadyLiked ? old.count - 1 : old.count + 1,
          users: alreadyLiked
            ? old.users.filter((u) => u.id !== currentUserId)
            : [
                ...old.users,
                { id: currentUserId, username: "", profile_image: null },
              ],
        };
      });

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(likesKey(postId), ctx.previous);
    },
    onSettled: () => {
      // ✅ sync الـ likes_count في قائمة الـ posts
      queryClient.invalidateQueries({ queryKey: likesKey(postId) });
      queryClient.invalidateQueries({ queryKey: POSTS_KEY });
    },
  });
};
