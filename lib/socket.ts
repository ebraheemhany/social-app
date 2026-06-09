import io from "socket.io-client";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const socket = io(process.env.NEXT_PUBLIC_BASE_API_URL!, {
  autoConnect: true,
});

socket.on("connect", () => {
  const token = Cookies.get("accessToken");
  if (token) {
    try {
      const decoded = jwtDecode<{ userId: number }>(token);
      socket.emit("register", decoded.userId);
    } catch {}
  }
});

export default socket;
