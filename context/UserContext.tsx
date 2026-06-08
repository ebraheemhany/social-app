"use client";

import { createContext, useContext, useState } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  profile_image: string | null;
  bio: string | null;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  messageCount: number;
  setMessageCount: (count: number) => void;
  notificationCount: number;
  setNotificationCount: (count: number) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUser] = useState<User | null>(null);
  const [messageCount, setMessageCount] = useState<number>(0);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  return (
    <UserContext.Provider
      value={{
        user: userData,
        setUser,
        messageCount,
        setMessageCount,
        notificationCount,
        setNotificationCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};
