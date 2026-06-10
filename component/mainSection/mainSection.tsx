"use client";
import React, { useEffect } from "react";
import StoriesBar from "../items/StoriesBar";
import CreatePost from "../items/CreatePost";
import CommentSection from "../items/CommentSection";
import { useGetAllPosts } from "@/Query/useGetAllPosts";
import { useNotifications } from "@/Query/useNotifications";
import { useUser } from "@/context/UserContext";
import { useConversations } from "@/Query/useChat";
import { PostSkeleton } from "../items/skiltonPost";
const MainSection = () => {
  const { data: posts, isLoading, error, refetch } = useGetAllPosts();

  //  notifications and save it in context
  const { setNotificationCount, setMessageCount } = useUser();
  const { data } = useNotifications();
  const unreadCount = data?.unread ?? 0;
  useEffect(() => {
    setNotificationCount(unreadCount);
  }, [unreadCount]);

  // add message count in context
  const { data: conversations = [], isLoading: convLoading } =
    useConversations();
  const totalUnread = conversations.reduce(
    (sum, conv) => sum + Number(conv.unread_count ?? 0),
    0,
  );
  useEffect(() => {
    setMessageCount(totalUnread);
  }, [totalUnread]);

  return (
    <div>
      <StoriesBar />
      <CreatePost onPostCreated={refetch} />

      {isLoading ? (
        <div className="text-gray-400 text-center mt-10">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : error ? (
        <div className="text-red-400 text-center mt-10">
          Failed to load posts
        </div>
      ) : posts?.length === 0 ? (
        <div className="text-gray-400 text-center mt-10">No posts yet</div>
      ) : (
        <div className="flex flex-col gap-2">
          {posts?.map((post) => (
            <CommentSection key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainSection;
