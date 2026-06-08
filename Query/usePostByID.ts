"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useGetPost = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/posts/${id}`);
      return data.post ?? data;
    },
    enabled: !!id,
  });
};
