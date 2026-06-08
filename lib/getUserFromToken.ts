import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  userId: string;
  email: string;
};

export const getUserFromToken = (): TokenPayload | null => {
  if (typeof window === "undefined") return null;

  const token = Cookies.get("accessToken");

  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
};
