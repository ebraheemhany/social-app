"use client";
import React from "react";
import StoriesBar from "../items/StoriesBar";
import CreatePost from "../items/CreatePost";
import CommentSection from "../items/CommentSection";
import { useGetAllPosts } from "@/Query/useGetAllPosts";

const MainSection = () => {
  const { data: posts, isLoading, error, refetch } = useGetAllPosts();

  return (
    <div>
      <StoriesBar />
      <CreatePost onPostCreated={refetch} />

      {isLoading ? (
        <div className="text-gray-400 text-center mt-10">Loading...</div>
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
