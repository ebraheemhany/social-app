"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LeftSection from "@/component/leftSection/leftSection";
import PostCard from "./../../../../component/items/PostCard";
import CommentSection from "@/component/items/CommentSection";
import RighteSection from "@/component/righteSection/righteSection";
import { useGetPost } from "@/Query/usePostByID";
export default function PostPage() {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading, error } = useGetPost(id);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading post</p>;

  return (
    <div className="w-full flex justify-center">
      {/* container */}
      <div className="w-[100%] md:w-[95%] lg:w-[90%] relative bg-black text-white">
        <div className="flex gap-4">
          {/* left section (fixed) */}
          <div className="hidden md:block md:w-[30%] lg:w-[20%]">
            <div className="fixed top-0 h-screen md:w-[25%] lg:w-[16%]">
              <LeftSection />
            </div>
          </div>

          {/* main section */}
          <div className="w-[100%] md:w-[70%] lg:w-[60%] mt-22 md:mt-10 mb-20 md:mb-0">
            <CommentSection post={post} />
          </div>

          {/* right section */}
          <div className="w-[20%] hidden lg:block">
            <div className="fixed top-0 w-[16%]">
              <RighteSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
