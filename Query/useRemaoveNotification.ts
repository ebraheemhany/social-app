import { removeNotificationById } from "@/service/service";
import { useMutation } from "@tanstack/react-query";

export const useRemoveNotification = () => {
  return useMutation({
    mutationFn: (id: string) => removeNotificationById(id),
    // ✅ مش محتاج invalidateQueries — الـ realtime بيتولى الأمر
    onError: (error) => {
      console.error("Failed to remove notification:", error);
    },
  });
};