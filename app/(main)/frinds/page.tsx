"use client";

import { useState } from "react";
import Image from "next/image";
import LeftSection from "@/component/leftSection/leftSection";
import RighteSection from "@/component/righteSection/righteSection";
import { useRouter } from "next/navigation";
import { useGetFriends } from "@/Query/useGetFriends";
import { useGetOrCreateConversation } from "@/Query/useChat";

const tabs = [
  { key: "friends", label: "All Friends" },
  { key: "requests", label: "Requests" },
  { key: "suggestions", label: "Suggestions" },
];

export default function FriendsPage() {
  const [tab, setTab] = useState("friends");
  const router = useRouter();

  const { data: friends = [], isLoading } = useGetFriends();
  const { mutate: getOrCreateConv, isPending: isLoadingMessage } =
    useGetOrCreateConversation();

  const handleMessage = (friendId: number) => {
    getOrCreateConv(friendId, {
      onSuccess: (conv) => {
        router.push(`/Messages?conv=${conv.id}`);
      },
    });
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
            <div className="mx-3 md:mx-0 bg-[#0f0f10] border border-gray-800 rounded-3xl p-5">
              {/* Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Friends</h1>
                  <p className="text-gray-400 text-sm">
                    Manage your friends and requests
                  </p>
                </div>
                <span className="bg-[#1b1b1f] px-3 py-2 rounded-full text-sm text-gray-400 self-start">
                  {friends.length} Friends
                </span>
              </div>

              {/* Tabs */}
              <div className="flex gap-3 mt-4">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      tab === t.key
                        ? "bg-blue-600 text-white"
                        : "bg-[#1a1a1b] text-gray-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Friends */}
              {tab === "friends" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                  {isLoading ? (
                    [...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-32 bg-[#1a1a1b] rounded-xl animate-pulse"
                      />
                    ))
                  ) : friends.length === 0 ? (
                    <p className="text-gray-400 col-span-3 text-center py-10">
                      No friends yet
                    </p>
                  ) : (
                    friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="bg-[#161618] p-4 rounded-xl flex flex-col items-center"
                      >
                        {friend.profile_image ? (
                          <Image
                            src={friend.profile_image}
                            alt={friend.username}
                            width={80}
                            height={80}
                            className="rounded-full object-cover w-20 h-20"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-blue-700 flex items-center justify-center text-2xl font-bold">
                            {friend.username?.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <h3 className="font-semibold mt-2">
                          {friend.username}
                        </h3>
                        <p className="text-gray-500 text-xs text-center mt-1 line-clamp-2">
                          {friend.bio || "No bio"}
                        </p>

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() =>
                              router.push(`/OuherProfile/${friend.id}`)
                            }
                            className="bg-[#1a1a1b] border border-gray-700 px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-gray-700 transition"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => handleMessage(friend.id)}
                            disabled={isLoadingMessage}
                            className="bg-blue-600 px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-blue-700 transition disabled:opacity-50"
                          >
                            Message
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Requests */}
              {tab === "requests" && (
                <p className="text-gray-400 mt-5 text-center">
                  No requests yet
                </p>
              )}

              {/* Suggestions */}
              {tab === "suggestions" && (
                <p className="text-gray-400 mt-5 text-center">
                  No suggestions yet
                </p>
              )}
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
