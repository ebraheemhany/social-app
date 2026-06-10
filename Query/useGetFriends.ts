import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Friend {
  id: number;
  username: string;
  profile_image: string | null;
  bio: string | null;
}

export const FRIENDS_KEY = ["friends"] as const;

export const useGetFriends = () => {
  return useQuery<Friend[]>({
    queryKey: FRIENDS_KEY,
    queryFn: async () => {
      const { data } = await api.get("/api/friends");
      return data.friends;
    },
    staleTime: 30 * 1000,
  });
};
