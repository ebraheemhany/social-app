import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useGetCurrentUser } from "./useGetUserByid";
import { getUserFromToken } from "@/lib/getUserFromToken";
import Cookies from "js-cookie";

const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 دقيقة

export const useInitializeUser = () => {
  const { setUser } = useUser();
  const tokenUser = getUserFromToken();
  const { data: user, isLoading } = useGetCurrentUser(tokenUser?.userId ?? "");

  useEffect(() => {
    if (user && !isLoading) {
      setUser(user);
    }
  }, [user, isLoading, setUser]);

  // ✅ Auto refresh accessToken كل 14 دقيقة
  useEffect(() => {
    const refresh = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        },
      );

      const data = await res.json();
      if (data.accessToken) {
        Cookies.set("accessToken", data.accessToken, {
          expires: 1 / 96,
          secure: false,
          sameSite: "lax",
          path: "/",
        });
      }
    };

    const interval = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { isLoading };
};
