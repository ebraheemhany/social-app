import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

import { QueryProvider } from "@/component/items/QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserProvider } from "@/context/UserContext";
import UserInitializer from "@/component/items/UserInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Yalla Book",
  description:
    "Yalla Book is a social media platform where you can share posts, follow friends, chat in real-time, and stay connected with your community.",
  icons: {
    icon: "/icon/logo.svg",
    apple: "/icon/logo.svg",
  },
  keywords: [
    "social media",
    "yalla book",
    "posts",
    "follow",
    "chat",
    "notifications",
    "community",
  ],
  authors: [{ name: "Yalla Book" }],
  openGraph: {
    title: "Yalla Book",
    description:
      "Share posts, follow friends, and chat in real-time on Yalla Book.",
    url: "https://your-app.vercel.app",
    siteName: "Yalla Book",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yalla Book",
    description:
      "Share posts, follow friends, and chat in real-time on Yalla Book.",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UserProvider>
          <QueryProvider>
            <UserInitializer />
            {/* <Header /> */}
            {children}
            {/* <BottomNav /> */}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryProvider>
        </UserProvider>
        <Toaster richColors position="top-center" duration={2000} />
      </body>
    </html>
  );
}
