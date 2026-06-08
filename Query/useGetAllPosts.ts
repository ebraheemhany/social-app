import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Post {
  id: number;
  content: string;
  media_url: string | null;
  media_type: "image" | "video" | null;
  created_at: string;
  user_id: number;
  username: string;
  profile_image: string | null;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

export const POSTS_KEY = ["posts"] as const;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useGetAllPosts = () => {
  return useQuery<Post[]>({
    queryKey: POSTS_KEY,
    queryFn: async () => {
      const { data } = await api.get("/api/posts");
      return data.posts;
    },
    staleTime: 30 * 1000,
  });
};

export const useGetTrendingPosts = () => {
  return useQuery<Post[]>({
    queryKey: ["trending-posts"],
    queryFn: async () => {
      const { data } = await api.get("/api/posts/trending");
      return data.posts;
    },
    staleTime: 60 * 1000,
  });
};
