"use client";

import { useState } from "react";
import Image from "next/image";
import LeftSection from "@/component/leftSection/leftSection";
import RighteSection from "@/component/righteSection/righteSection";
import { useNotifications } from "@/Query/useNotification";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import type { NotificationTyping } from "@/typing/type";
import { useGetCurrentUser } from "@/Query/useGetUserByid";
import { X } from "lucide-react";

const tabs = [
  { key: "all", label: "all" },
  { key: "like", label: "likes" },
  { key: "follow", label: "follows" },
  { key: "comment", label: "comments" },
  { key: "message", label: "messages" },
];

const getMessage = (type: string, username: string) => {
  switch (type) {
    case "like":
      return `${username} liked your post ❤️`;
    case "follow":
      return `${username} started following you 👤`;
    case "comment":
      return `${username} commented on your post 💬`;
    case "message":
      return `${username} sent you a message ✉️`;
    default:
      return "";
  }
};

export default function NotificationsPage() {
  const [tab, setTab] = useState("all");
  const { data } = useGetCurrentUser();

  const userId = data?.profile.id ?? "";

  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    loadMore,
    markAllAsRead,
    removeNotification, // ✅ من الـ hook مباشرة
  } = useNotifications(userId);

  const filtered: NotificationTyping[] =
    tab === "all" ? notifications : notifications.filter((n) => n.type === tab);

  const router = useRouter();
  const handleNotificationClick = (notif: any) => {
    switch (notif.type) {
      case "like":
      case "comment":
        if (notif.post_id) router.push(`/posts/${notif.post_id}`);
        break;
      case "follow":
        if (notif.sender_id) router.push(`/OuherProfile/${notif.sender_id}`);
        break;
      case "message":
        if (notif.chat_id) router.push(`/Messages?conv=${notif.chat_id}`);
        break;
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-[95%] lg:w-[90%] relative bg-black text-white">
        <div className="flex gap-4">
          {/* Left */}
          <div className="hidden md:block md:w-[30%] lg:w-[20%]">
            <div className="fixed top-0 h-screen md:w-[25%] lg:w-[16%]">
              <LeftSection />
            </div>
          </div>

          {/* Main */}
          <div className="w-full md:w-[70%] lg:w-[60%] mt-22 md:mt-10">
            <div className="mx-3 md:mx-0 bg-[#0f0f10] border border-gray-800 rounded-3xl p-5 shadow-sm">
              <div className="flex flex-col gap-5">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                          {unreadCount}
                        </span>
                      )}
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                      Follow updates of your interactions in one place
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                    <span className="bg-[#1b1b1f] px-3 py-2 rounded-full">
                      {filtered.length} Notifications
                    </span>
                    <span className="bg-[#1b1b1f] px-3 py-2 rounded-full capitalize">
                      {tabs.find((item) => item.key === tab)?.label}
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full transition"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-3">
                  {tabs.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setTab(item.key)}
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        tab === item.key
                          ? "bg-blue-600 text-white"
                          : "bg-[#1a1a1b] text-gray-300 hover:bg-[#2a2a2c]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Loading skeleton */}
                {loading && notifications.length === 0 && (
                  <div className="flex flex-col gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 rounded-3xl bg-[#1a1a1b] animate-pulse"
                      />
                    ))}
                  </div>
                )}

                {/* Notifications List */}
                {!loading || notifications.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {filtered.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-gray-700 bg-[#151518] p-6 text-center text-gray-400">
                        There are no notifications in this section at the
                        moment.
                      </div>
                    ) : (
                      filtered.map((notif) => (
                        <div
                          key={notif.id}
                          className={`flex flex-col gap-4 rounded-3xl border p-4 transition ${
                            notif.is_read
                              ? "border-gray-800 bg-[#111116]"
                              : "border-blue-500 bg-[#151518]"
                          } hover:bg-[#1c1c1f]`}
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            {/* ✅ w-full على الـ parent */}
                            <div className="flex items-center gap-3 w-full">
                              {/* Avatar */}
                              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-700 shrink-0">
                                {notif.sender?.avatar_url ? (
                                  <Image
                                    src={notif.sender.avatar_url}
                                    alt={notif.sender.username}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg bg-blue-600">
                                    {notif.sender?.username?.[0]?.toUpperCase()}
                                  </div>
                                )}
                              </div>

                              {/* Message + Time + X */}
                              <div className="w-full flex justify-between items-center">
                                <div
                                  className="cursor-pointer"
                                  onClick={() => handleNotificationClick(notif)}
                                >
                                  <p className="text-sm text-gray-100">
                                    {getMessage(
                                      notif.type,
                                      notif.sender?.username ?? "Someone",
                                    )}
                                  </p>
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(
                                      new Date(notif.created_at),
                                      { addSuffix: true },
                                    )}
                                  </span>
                                </div>

                                {/* ✅ shrink-0 عشان متنضغطش */}
                                <X
                                  onClick={() => removeNotification(notif.id)}
                                  size={20}
                                  className="cursor-pointer hover:text-red-500 shrink-0"
                                />
                              </div>
                            </div>

                            {notif.type === "follow" && (
                              <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                                Follow
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}

                    {hasMore && (
                      <button
                        onClick={loadMore}
                        disabled={loading}
                        className="w-full py-3 rounded-3xl border border-gray-700 text-gray-400 hover:bg-[#1a1a1b] transition text-sm disabled:opacity-50"
                      >
                        {loading ? "Loading..." : "Load more"}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="w-[20%] hidden lg:block">
            <div className="fixed top-0 w-[20%]">
              <RighteSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
