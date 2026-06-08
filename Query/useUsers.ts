import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface SuggestedUser {
  id: number;
  username: string;
  email: string;
  profile_image: string | null;
  bio: string | null;
}

export const useGetSuggestedUsers = () => {
  return useQuery<SuggestedUser[]>({
    queryKey: ["suggested-users"],
    queryFn: async () => {
      const { data } = await api.get("/api/users");
      return data.users;
    },
    staleTime: 60 * 1000,
  });
};
