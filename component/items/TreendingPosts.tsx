"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetTrendingPosts } from "@/Query/useGetAllPosts";

const TrendingPosts = () => {
  const router = useRouter();
  const { data: posts = [], isLoading, error } = useGetTrendingPosts();

  if (isLoading) {
    return (
      <div className="mx-2 mb-20">
        <p className="text-[14px] text-gray-300 mb-3">Suggested posts</p>
        <div className="columns-2 md:columns-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="mb-3 h-[180px] rounded-xl bg-[#1E1E22] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) return null;
  if (posts.length === 0) return null;

  return (
    <div className="mx-2 mb-20">
      <p className="text-[14px] text-gray-300 mb-3">Suggested posts</p>

      <div className="columns-2 md:columns-3 gap-3">
        {posts.slice(0, 3).map((post) => (
          <div
            key={post.id}
            onClick={() => router.push(`/posts/${post.id}`)}
            className=" h-[200px] mb-3 break-inside-avoid bg-[#1E1E22] border border-gray-700 rounded-xl overflow-hidden hover:translate-y-[-2px] transition cursor-pointer"
          >
            {/* Media */}
            {post.media_url && post.media_type === "image" && (
              <div className="relative h-[120px]">
                <Image
                  src={post.media_url}
                  alt="post"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {post.media_url && post.media_type === "video" && (
              <div className="relative h-[120px]">
                <video
                  src={post.media_url}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-3">
              {post.content && (
                <p className="text-white text-sm mb-2 line-clamp-2">
                  {post.content}
                </p>
              )}
              <div className="flex gap-2 text-xs text-gray-400">
                <span>❤️ {post.likes_count}</span>
                <span>💬 {post.comments_count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;
