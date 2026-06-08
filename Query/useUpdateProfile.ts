import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

// export const useUpdateProfile = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (formData: FormData) => {
//       const { data } = await api.put("/api/user/profile/update", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       return data.user;
//     },
//     onSuccess: (updatedUser) => {
//       // حدّث الـ cache تلقائي
//       queryClient.invalidateQueries({ queryKey: ["currentUser"] });
//     },
//   });
// };

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.put("/api/user/profile/update", formData);
      // ❌ شيل headers بالكامل — axios بيحط Content-Type صح لوحده مع FormData
      return data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
