import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      formData,
    }: {
      postId: string;
      formData: FormData;
    }) => {
      const { data } = await api.put(`/api/posts/${postId}`, formData);
      return data.post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
};
