"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LeftSection from "@/component/leftSection/leftSection";
import RighteSection from "@/component/righteSection/righteSection";
// import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { getOrCreateConversation } from "@/service/service";

const tabs = [
  { key: "friends", label: "جميع الأصدقاء" },
  { key: "requests", label: "الطلبات" },
  { key: "suggestions", label: "الاقتراحات" },
];

export default function FriendsPage() {
  const [tab, setTab] = useState("friends");
  // const [session, setSession] = useState<any>(null);

  // const [friends, setFriends] = useState<any[]>([]);
  const router = useRouter();

  // ─────────────── get session ───────────────
  // useEffect(() => {
  //   const getSession = async () => {
  //     const { data } = await supabase.auth.getSession();
  //     setSession(data.session);
  //   };

  //   getSession();
  // }, []);

  // ─────────────── get real friends from DB ───────────────
  // useEffect(() => {
  //   const fetchFriends = async () => {
  //     if (!session?.user?.id) return;

  //     const { data, error } = await supabase
  //       .from("profiles")
  //       .select("id, username, avatar_url");

  //     if (!error) {
  //       setFriends(data || []);
  //     }
  //   };

  //   fetchFriends();
  // }, [session]);

  // if (!session) return null;

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
                  <h1 className="text-2xl font-bold">الأصدقاء</h1>
                  <p className="text-gray-400 text-sm">
                    إدارة أصدقائك وطلبات الصداقة
                  </p>
                </div>

                {/* <div className="flex gap-2 text-sm text-gray-400">
                  <span className="bg-[#1b1b1f] px-3 py-2 rounded-full">
                    {friends.length} صديق
                  </span>
                </div> */}
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
              {/* {tab === "friends" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="bg-[#161618] p-4 rounded-xl flex flex-col items-center"
                    >
                      <Image
                        src={friend.avatar_url || "/avatar.png"}
                        alt="avatar"
                        width={80}
                        height={80}
                        className="rounded-full"
                      />

                      <h3 className="font-semibold mt-2">{friend.username}</h3>

                      <div className="flex gap-2 mt-3">
                        <button className="bg-red-600 px-3 py-1 rounded-lg text-sm cursor-pointer">
                          delete
                        </button>

                        <button
                          disabled={!session?.user?.id}
                          onClick={async () => {
                            if (!session?.user?.id) return;

                            const convId = await getOrCreateConversation(
                              session.user.id,
                              friend.id,
                            );

                            router.push(`/Messages?conv=${convId}`);
                          }}
                          className="bg-blue-600 px-3 py-1 rounded-lg text-sm cursor-pointer"
                        >
                          chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )} */}

              {/* Requests */}
              {tab === "requests" && (
                <p className="text-gray-400 mt-5">No requests yet</p>
              )}

              {/* Suggestions */}
              {tab === "suggestions" && (
                <p className="text-gray-400 mt-5">No suggestions yet</p>
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
