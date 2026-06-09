import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Story {
  id: number;
  media_url: string | null;
  media_type: "image" | "video" | "text";
  caption: string | null;
  created_at: string;
  expires_at: string;
  is_viewed: boolean;
}

export interface StoryGroup {
  user_id: number;
  username: string;
  profile_image: string | null;
  stories: Story[];
}

export interface StoryView {
  id: number;
  username: string;
  profile_image: string | null;
  viewed_at: string;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

export const STORIES_KEY = ["stories"] as const;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useGetStories = () => {
  return useQuery<StoryGroup[]>({
    queryKey: STORIES_KEY,
    queryFn: async () => {
      const { data } = await api.get("/api/stories");
      return data.stories;
    },
    staleTime: 0,
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/api/stories", formData, {
        headers: { "Content-Type": undefined }, // ✅ خلي axios يحدده تلقائياً
      });
      return data.story as Story;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STORIES_KEY });
    },
  });
};

export const useViewStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storyId: number) => {
      const { data } = await api.post(`/api/stories/${storyId}/view`);
      return data;
    },
    onMutate: async (storyId) => {
      await queryClient.cancelQueries({ queryKey: STORIES_KEY });
      const previous = queryClient.getQueryData<StoryGroup[]>(STORIES_KEY);

      // ✅ Optimistic — علّم الـ story كمشاهدة فوراً
      queryClient.setQueryData<StoryGroup[]>(STORIES_KEY, (old) =>
        (old ?? []).map((group) => ({
          ...group,
          stories: group.stories.map((s) =>
            s.id === storyId ? { ...s, is_viewed: true } : s,
          ),
        })),
      );

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(STORIES_KEY, ctx.previous);
    },
  });
};

export const useDeleteStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storyId: number) => {
      const { data } = await api.delete(`/api/stories/${storyId}`);
      return data;
    },
    onMutate: async (storyId) => {
      await queryClient.cancelQueries({ queryKey: STORIES_KEY });
      const previous = queryClient.getQueryData<StoryGroup[]>(STORIES_KEY);

      // ✅ Optimistic — شيل الـ story من الـ group
      queryClient.setQueryData<StoryGroup[]>(
        STORIES_KEY,
        (old) =>
          (old ?? [])
            .map((group) => ({
              ...group,
              stories: group.stories.filter((s) => s.id !== storyId),
            }))
            .filter((group) => group.stories.length > 0), // ✅ شيل الـ group لو فضت
      );

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(STORIES_KEY, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: STORIES_KEY });
    },
  });
};

export const useGetStoryViews = (storyId: number, enabled: boolean) => {
  return useQuery<{ count: number; views: StoryView[] }>({
    queryKey: ["story-views", storyId],
    queryFn: async () => {
      const { data } = await api.get(`/api/stories/${storyId}/views`);
      return data;
    },
    enabled: enabled && !!storyId,
  });
};
