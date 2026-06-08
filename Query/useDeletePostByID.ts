import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useDeletePostByID = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await api.delete(`/api/posts/${postId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
};
