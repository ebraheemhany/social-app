import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useGetCurrentUser = (id: string) => {
  return useQuery({
    queryKey: ["currentUser", id],
    queryFn: async () => {
      const response = await api.get(`/api/user/profile/${id}`);
      const data = response.data;
      console.log("useGetCurrentUser response:", data);
      return data.user;
    },
    enabled: !!id,
  });
};
export const useGetUserPosts = (userId: string) => {
  return useQuery<any[]>({
    queryKey: ["userPosts", userId],
    queryFn: async () => {
      const response = await api.get(`/api/posts/user/${userId}`);
      const data = response.data;
      console.log("useGetUserPosts full response:", data);
      console.log("userId being used:", userId);

      // Handle different response formats
      if (Array.isArray(data)) {
        return data;
      }
      return data.posts || data.data || [];
    },
    enabled: !!userId,
  });
};
