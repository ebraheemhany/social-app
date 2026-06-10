"use client";

import Image from "next/image";
import LeftSection from "@/component/leftSection/leftSection";
import RighteSection from "@/component/righteSection/righteSection";
import { useGetSavedPosts, useToggleSavePost } from "@/Query/useSavedPosts";
import { Bookmark, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SavedSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="aspect-square bg-[#1a1a1b] rounded-xl animate-pulse"
      />
    ))}
  </div>
);

export default function SavedPage() {
  const router = useRouter();
  const { data: savedPosts = [], isLoading } = useGetSavedPosts();
  const { mutate: toggleSave, isPending } = useToggleSavePost();

  const handleUnsave = (postId: number) => {
    toggleSave(postId, {
      onSuccess: () => toast.success("Removed from saved"),
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
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Bookmark className="w-6 h-6 text-yellow-400" />
                    Saved Posts
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Posts you saved for later
                  </p>
                </div>
                <span className="bg-[#1b1b1f] px-3 py-2 rounded-full text-sm text-gray-400 self-start">
                  {savedPosts.length} Saved
                </span>
              </div>

              {/* Content */}
              {isLoading ? (
                <SavedSkeleton />
              ) : savedPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <Bookmark className="w-16 h-16 mb-4 text-gray-700" />
                  <p className="text-lg font-medium">No saved posts yet</p>
                  <p className="text-sm mt-1">
                    Save posts to view them here later
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {savedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-[#161618] rounded-xl overflow-hidden group relative cursor-pointer"
                    >
                      {/* Media */}
                      <div
                        className="aspect-square relative"
                        onClick={() => router.push(`/posts/${post.id}`)}
                      >
                        {post.media_type === "image" && post.media_url ? (
                          <Image
                            src={post.media_url}
                            alt="post"
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : post.media_type === "video" && post.media_url ? (
                          <video
                            src={post.media_url}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-4 bg-[#1a1a1b]">
                            <p className="text-gray-300 text-xs text-center line-clamp-4">
                              {post.content}
                            </p>
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition" />
                      </div>

                      {/* Info */}
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          {post.profile_image ? (
                            <Image
                              src={post.profile_image}
                              alt={post.username}
                              width={28}
                              height={28}
                              className="rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                              {post.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <p className="text-sm text-gray-300 truncate">
                            {post.username}
                          </p>
                        </div>

                        {/* Unsave Button */}
                        <button
                          onClick={() => handleUnsave(post.id)}
                          disabled={isPending}
                          className="text-blue-700 hover:text-red-400 transition disabled:opacity-50 shrink-0 ml-2"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
