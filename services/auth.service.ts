import axios from "@/lib/axios";
import api from "@/lib/axios";

export const authApi = {
  // register
  register: async ({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }) => {
    const res = await api.post("/api/register", { email, password, username });
    return res.data;
  },

  // login
  login: async ({ email, password }: { email: string; password: string }) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/login`,
      { email, password },
      { withCredentials: true }, // ✅ مهم عشان الـ cookie تتحفظ
    );
    return res.data;
  },
  // logout
  logout: async () => {
    const res = await api.post("/api/logout");
    return res.data;
  },

  // refresh token
  refreshToken: async () => {
    const res = await api.post("/api/refresh");
    return res.data;
  },

  // forget password
  forgetPassword: async (email: string) => {
    const res = await api.post("/api/forget-password", { email });
    return res.data;
  },

  // verify otp
  verifyOtp: async (email: string, otp: string) => {
    const res = await api.post("/api/verify-otp", { email, otp });
    return res.data;
  },

  // reset password
  resetPassword: async (email: string, newPassword: string) => {
    const res = await api.post("/api/reset-password", { email, newPassword });
    return res.data;
  },

  // get current user
  getCurrentUser: async (userId: string) => {
    const res = await api.get(`/api/user/profile/${userId}`);
    return res.data;
  },
};
