import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FollowUser {
  id: number;
  username: string;
  profile_image: string | null;
  bio: string | null;
  created_at: string;
}

export interface FollowStats {
  followers: number;
  following: number;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

export const followersKey = (userId: number) => ["followers", userId] as const;
export const followingKey = (userId: number) => ["following", userId] as const;
export const followStatsKey = (userId: number) =>
  ["follow-stats", userId] as const;
export const isFollowingKey = (userId: number) =>
  ["is-following", userId] as const;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useGetFollowers = (userId: number) => {
  return useQuery<{ followers: FollowUser[]; total: number }>({
    queryKey: followersKey(userId),
    queryFn: async () => {
      const { data } = await api.get(`/api/users/${userId}/followers`);
      return data;
    },
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
};

export const useGetFollowing = (userId: number) => {
  return useQuery<{ following: FollowUser[]; total: number }>({
    queryKey: followingKey(userId),
    queryFn: async () => {
      const { data } = await api.get(`/api/users/${userId}/following`);
      return data;
    },
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
};

export const useGetFollowStats = (userId: number) => {
  return useQuery<FollowStats>({
    queryKey: followStatsKey(userId),
    queryFn: async () => {
      const { data } = await api.get(`/api/users/${userId}/follow-stats`);
      return data;
    },
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
};

export const useIsFollowing = (userId: number) => {
  return useQuery<{ isFollowing: boolean }>({
    queryKey: isFollowingKey(userId),
    queryFn: async () => {
      const { data } = await api.get(`/api/users/${userId}/is-following`);
      return data;
    },
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useToggleFollow = (targetUserId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/api/users/${targetUserId}/follow`);
      return data as { message: string; following: boolean };
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: isFollowingKey(targetUserId),
      });
      await queryClient.cancelQueries({
        queryKey: followStatsKey(targetUserId),
      });

      const previousIsFollowing = queryClient.getQueryData<{
        isFollowing: boolean;
      }>(isFollowingKey(targetUserId));
      const previousStats = queryClient.getQueryData<FollowStats>(
        followStatsKey(targetUserId),
      );

      // ✅ Optimistic — toggle isFollowing
      queryClient.setQueryData<{ isFollowing: boolean }>(
        isFollowingKey(targetUserId),
        (old) => ({ isFollowing: !old?.isFollowing }),
      );

      // ✅ Optimistic — حدّث عدد الـ followers
  queryClient.setQueryData<FollowStats>(
  followStatsKey(targetUserId),
  (old) => {
    if (!old) return old;
    return {
      ...old,
      followers: old.following ? old.followers - 1 : old.followers + 1,
    };
  },
);

      return { previousIsFollowing, previousStats };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previousIsFollowing)
        queryClient.setQueryData(
          isFollowingKey(targetUserId),
          ctx.previousIsFollowing,
        );
      if (ctx?.previousStats)
        queryClient.setQueryData(
          followStatsKey(targetUserId),
          ctx.previousStats,
        );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: isFollowingKey(targetUserId) });
      queryClient.invalidateQueries({ queryKey: followStatsKey(targetUserId) });
      queryClient.invalidateQueries({ queryKey: followersKey(targetUserId) });
    },
  });
};
