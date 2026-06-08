"use client";

import { useInitializeUser } from "@/Query/useInitializeUser";

export default function UserInitializer() {
  useInitializeUser();
  return null;
}
