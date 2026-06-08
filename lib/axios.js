import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  withCredentials: true,
});

// دالة الـ refresh
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/refresh`,
    { refreshToken },
  );

  Cookies.set("accessToken", res.data.accessToken, {
    expires: 1 / 96,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  return res.data.accessToken;
}; // ← الـ } ناقصة هنا

// قبل كل request
api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") return config;

  const skipRefresh = ["/api/login", "/api/register", "/api/refresh"];
  if (skipRefresh.some((route) => config.url?.includes(route))) {
    return config;
  }

  let token = Cookies.get("accessToken");

  if (!token) {
    try {
      token = await refreshAccessToken();
    } catch {
      window.location.href = "/sign-in";
      return config;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// لو 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const token = await refreshAccessToken();
        error.config.headers.Authorization = `Bearer ${token}`;
        return api(error.config);
      } catch {
        Cookies.remove("accessToken");
        localStorage.removeItem("refreshToken");
        Cookies.remove("isLoggedIn");
        window.location.href = "/sign-in";
      }
    }

    if (error.response?.status === 429) {
      toast.error("تم إرسال الكثير من الطلبات، حاول مرة أخرى بعد قليل.");
    }

    return Promise.reject(error);
  },
);

export default api;
