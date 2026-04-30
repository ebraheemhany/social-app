"use client";

import { Home, Search, Bell, MessageSquareMore } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f1117] border-t border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Home */}
        <Link href="/">
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div
              className={`p-1.5 rounded-lg ${
                isActive("/") ? "bg-[#6366f1] text-white" : "text-gray-500"
              }`}
            >
              <Home size={15} fill={isActive("/") ? "currentColor" : "none"} />
            </div>
            <span
              className={`text-xs font-medium ${
                isActive("/") ? "text-[#6366f1]" : "text-gray-500"
              }`}
            >
              Home
            </span>
          </div>
        </Link>

        {/* Explore */}
        <Link href="/explore">
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div
              className={`p-1.5 rounded-lg ${
                isActive("/explore")
                  ? "bg-[#6366f1] text-white"
                  : "text-gray-500"
              }`}
            >
              <Search
                size={15}
                fill={isActive("/explore") ? "currentColor" : "none"}
              />
            </div>
            <span
              className={`text-xs font-medium ${
                isActive("/explore") ? "text-[#6366f1]" : "text-gray-500"
              }`}
            >
              Explore
            </span>
          </div>
        </Link>

        {/* Notifications */}
        <Link href="/Notifications">
          <div className="flex flex-col items-center gap-1 cursor-pointer relative">
            <div
              className={`p-1.5 rounded-lg ${
                isActive("/Notifications")
                  ? "bg-[#6366f1] text-white"
                  : "text-gray-500"
              }`}
            >
              <Bell
                size={15}
                fill={isActive("/Notifications") ? "currentColor" : "none"}
              />
            </div>

            {/* Notification Dot */}
            {isActive("/Notifications") && (
              <span className="absolute top-5 right-0 w-2 h-2 bg-orange-600 rounded-full border border-[#0f1117]"></span>
            )}

            <span
              className={`text-xs font-medium ${
                isActive("/Notifications") ? "text-[#6366f1]" : "text-gray-500"
              }`}
            >
              Alerts
            </span>
          </div>
        </Link>

        {/* Chat */}
        <Link href="/Messages">
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div
              className={`p-1.5 rounded-lg ${
                isActive("/Messages")
                  ? "bg-[#6366f1] text-white"
                  : "text-gray-500"
              }`}
            >
              <MessageSquareMore
                size={15}
                fill={isActive("/Messages") ? "currentColor" : "none"}
              />
            </div>
            <span
              className={`text-xs font-medium ${
                isActive("/Messages") ? "text-[#6366f1]" : "text-gray-500"
              }`}
            >
              Chat
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
