"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData, onProgress }: { formData: FormData; onProgress?: (percent: number) => void }) => {
      const response = await api.post("/api/posts", formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            onProgress?.(percent);
          }
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};