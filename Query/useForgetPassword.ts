// Query/useForgetPassword.ts
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import axios from "axios";



export const useSendOTP = () =>
  useMutation({
    mutationFn: (email: string) =>
      api.post(`/api/forget-password`, { email }),
  });

export const useVerifyOTP = () =>
  useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      api.post(`/api/verify-otp`, { email, otp }),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: ({ email, newPassword }: { email: string; newPassword: string }) =>
      api.post(`/api/reset-password`, { email, newPassword }),
  });