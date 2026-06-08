"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/services/auth.service";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// login
export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      Cookies.set("accessToken", data.accessToken, {
        expires: 1 / 96,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

      // ✅ حط cookie للـ proxy يشوفها
      Cookies.set("isLoggedIn", "true", {
        expires: 7, // نفس عمر الـ refreshToken
        secure: false,
        sameSite: "lax",
        path: "/",
      });
      localStorage.setItem("refreshToken", data.refreshToken);
      toast.success("login Successfully");
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "login failed");
    },
  });
};

// register
export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success("User registered successfully");
      router.push("/sign-in");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Registration failed");
    },
  });
};

// logout
export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      Cookies.remove("accessToken");
      toast.success("Logout Successfuly");
      router.push("/sign-in");
      localStorage.removeItem("refreshToken");
      Cookies.remove("isLoggedIn");
    },
  });
};
