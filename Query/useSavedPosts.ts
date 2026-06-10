import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface SavedPost {
  id: number;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
  username: string;
  profile_image: string | null;
}

export const SAVED_POSTS_KEY = ["saved-posts"] as const;

export const useGetSavedPosts = () => {
  return useQuery<SavedPost[]>({
    queryKey: SAVED_POSTS_KEY,
    queryFn: async () => {
      const { data } = await api.get("/api/saved-posts");
      return data.posts;
    },
    staleTime: 30 * 1000,
  });
};

export const useToggleSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const { data } = await api.post(`/api/posts/${postId}/save`);
      return data as { saved: boolean };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_POSTS_KEY });
    },
  });
};
