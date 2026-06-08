import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ["search", query],

    queryFn: async () => {
      const { data } = await api.get(
        `/api/posts/search?q=${encodeURIComponent(query)}`,
      );
      return data;
    },
    enabled: !!query,
  });
};
