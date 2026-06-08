"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { ArrowLeft, Check, CheckCheck, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

import LeftSection from "@/component/leftSection/leftSection";
import RighteSection from "@/component/righteSection/righteSection";
import { useConversations, useMessages, useSendMessage } from "@/Query/useChat";
import { useGetCurrentUser } from "@/Query/useGetUserByid";
import { useChatSocket } from "@/Query/useChatSocket";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

function MessagesContent({
  searchParams,
}: {
  searchParams: ReadonlyURLSearchParams;
}) {
  const [activeConvId, setActiveConvId] = useState<number | null>(
    searchParams.get("conv") ? Number(searchParams.get("conv")) : null,
  );
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(
    !!searchParams.get("conv"),
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const { setMessageCount, user } = useUser();

  const currentUserId = user?.id ? Number(user.id) : null;

  const { data: conversations = [], isLoading: convLoading } =
    useConversations();
  const activeConv = conversations.find((c) => c.id === activeConvId);
  const { data: messages = [], isLoading: msgLoading } = useMessages(
    activeConvId ?? 0,
  );
  const { mutate: sendMessage, isPending: isSending } = useSendMessage(
    activeConvId ?? 0,
  );

  // ✅ Real-time socket
  useChatSocket(activeConvId ?? 0);

  // ✅ Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !activeConvId) return;
    sendMessage(input, { onSuccess: () => setInput("") });
  };

  const handleSelectConv = (convId: number) => {
    setActiveConvId(convId);
    setMobileShowChat(true);
  };

  const handleBack = () => {
    setMobileShowChat(false);
    setActiveConvId(null);
  };

  const filteredConvs = conversations.filter((c) =>
    c.other_username?.toLowerCase().includes(search.toLowerCase()),
  );

  // add message count in context
  const totalUnread = conversations.reduce(
    (sum, conv) => sum + (conv.unread_count ?? 0),
    0,
  );
  useEffect(() => {
    setMessageCount(totalUnread);
  }, [totalUnread]);

  // ✅ Message status icon
  const MessageStatus = ({
    isOwn,
    isRead,
    isPending,
  }: {
    isOwn: boolean;
    isRead: boolean;
    isPending?: boolean;
  }) => {
    if (!isOwn) return null;
    if (isPending) return <Clock size={10} className="text-gray-500" />;
    if (isRead) return <CheckCheck size={10} className="text-blue-400" />;
    return <Check size={10} className="text-gray-400" />;
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
          <div className="w-full md:w-[70%] lg:w-[60%] mt-0 md:mt-10">
            <div
              className="bg-[#0f0f10] md:mx-0 md:border md:border-gray-800 md:rounded-3xl md:p-5
              md:shadow-sm  h-[100vh]  md:h-[calc(100vh-120px)] flex"
            >
              {/* ── INBOX ── */}
              <div
                className={`flex-col p-4  w-full md:w-[35%] md:border-r md:border-gray-800
                ${mobileShowChat ? "hidden md:flex" : "flex"}`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold mb-4">Messages</h2>
                  <Link href={"/"}>
                    <ArrowRight />
                  </Link>
                </div>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="bg-[#1a1a1b] p-2 rounded-lg mb-4 outline-none text-sm"
                />

                <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto custom-scroll">
                  {convLoading && (
                    <p className="text-gray-500 text-sm text-center mt-4">
                      Loading...
                    </p>
                  )}
                  {!convLoading && filteredConvs.length === 0 && (
                    <p className="text-gray-500 text-sm text-center mt-4">
                      No conversations yet
                    </p>
                  )}

                  {filteredConvs.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConv(conv.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-[#1c1c1f] transition ${
                        activeConvId === conv.id ? "bg-[#1c1c1f]" : ""
                      }`}
                    >
                      {conv.other_profile_image ? (
                        <Image
                          src={conv.other_profile_image}
                          alt={conv.other_username}
                          width={45}
                          height={45}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-[45px] h-[45px] rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                          {conv.other_username?.[0]?.toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {conv.other_username}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {conv.last_message ?? "No messages yet"}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {conv.last_message_at && (
                          <span className="text-[10px] text-gray-500">
                            {format(new Date(conv.last_message_at), "hh:mm a")}
                          </span>
                        )}
                        {conv.unread_count > 0 && (
                          <span className="bg-blue-600 text-xs px-2 py-0.5 rounded-full">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── CHAT ── */}
              <div
                className={`flex-col flex-1 ${mobileShowChat ? "flex" : "hidden md:flex"}`}
              >
                {!activeConvId ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <span className="text-5xl mb-3">💬</span>
                    <p className="text-sm">
                      Select a conversation to start messaging
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-gray-400 bg-[#1a1a1b]">
                      <button
                        onClick={handleBack}
                        className="md:hidden p-1 rounded-full hover:bg-[#1c1c1f] transition"
                      >
                        <ArrowLeft size={20} />
                      </button>

                      {activeConv?.other_profile_image ? (
                        <Image
                          src={activeConv.other_profile_image}
                          alt={activeConv.other_username}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-[40px] h-[40px] rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                          {activeConv?.other_username?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <h3 className="font-semibold">
                        {activeConv?.other_username ?? "User"}
                      </h3>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 min-h-0 p-4 overflow-y-auto flex flex-col gap-2 custom-scroll">
                      {msgLoading && (
                        <p className="text-gray-500 text-sm text-center">
                          Loading...
                        </p>
                      )}

                      {messages.map((msg) => {
                        const isOwn = msg.sender_id === currentUserId;
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                          >
                            <div
                              className={`max-w-[75%] md:max-w-[60%] px-4 py-2 rounded-2xl text-sm ${
                                isOwn
                                  ? "bg-blue-600 text-white rounded-br-sm"
                                  : "bg-[#1a1a1b] text-white rounded-bl-sm"
                              }`}
                            >
                              {msg.content}
                            </div>

                            {/* ✅ Time + Status */}
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[10px] text-gray-500">
                                {format(new Date(msg.created_at), "hh:mm a")}
                              </span>
                              <MessageStatus
                                isOwn={isOwn}
                                isRead={msg.is_read}
                                isPending={
                                  isSending &&
                                  msg.id === messages[messages.length - 1]?.id
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                      <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-800 flex gap-2">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 bg-[#1a1a1b] p-2 rounded-lg outline-none text-sm"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isSending}
                        className="bg-blue-600 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-40 transition"
                      >
                        {isSending ? "Send.." : "Send"}
                      </button>
                    </div>
                  </>
                )}
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

function SearchParamsWrapper({
  children,
}: {
  children: (sp: ReadonlyURLSearchParams) => React.ReactNode;
}) {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper>
        {(searchParams) => <MessagesContent searchParams={searchParams} />}
      </SearchParamsWrapper>
    </Suspense>
  );
}
