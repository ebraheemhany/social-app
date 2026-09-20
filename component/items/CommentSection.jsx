"use client";
import Image from "next/image";
import LikesCompo from "./LikesCompo";
import CommentCompo from "./CommentCompo";
import Link from "next/link";
import { useToggleSavePost } from "@/Query/useSavedPosts";
import { Bookmark } from "lucide-react";

const reactions = ["❤️", "😮", "😂"];

export default function CommentSection({ post }) {
  const { mutate: toggleSave, isPending: isSaving } = useToggleSavePost();

  if (!post) {
    return null;
  }

  const likesCount = post.likes_count ?? 0;
  const commentsCount = post.comments_count ?? 0;

  const getInitials = (username) => username?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="w-[97%] mx-auto mb-8 rounded-2xl bg-[#1E1E22] border border-gray-500 overflow-hidden my-4">
      <div className="px-5 pt-4 pb-3">
        {/* Header */}
        <Link href={`/OuherProfile/${post.user_id}`}>
          <div className="flex items-center gap-2.5 mb-3">
            {post.profile_image ? (
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src={post.profile_image}
                  alt="avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium shrink-0">
                {getInitials(post.username)}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-white">{post.username}</p>
              <span className="text-xs text-gray-400">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>

        {post.media_url ? (
          <>
            <p className="text-sm text-gray-200 mb-3">{post.content}</p>
            <div className="mb-3 relative w-full overflow-hidden rounded-xl aspect-4/5 bg-black">
              {post.media_type === "image" && (
                <Image
                  src={post.media_url}
                  alt="post"
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-contain"
                />
              )}
              {post.media_type === "video" && (
                <video
                  src={post.media_url}
                  controls
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-200 mb-3">{post.content}</p>
        )}

        {/* Counts */}
        <div className="flex items-center justify-between px-1 py-3">
          <div className="flex items-center gap-2">
            <div className="flex">
              {reactions.map((r, i) => (
                <span key={i} className="text-base">
                  {r}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {likesCount} · {commentsCount} تعليق
            </span>
          </div>
        </div>

        <div className="border-t border-gray-700 -mx-5" />

        {/* Actions */}
        <div className="flex min-w-0 items-start gap-1 pt-2">
          <LikesCompo
            postId={post.id}
            isLiked={post.is_liked}
            likesCount={post.likes_count}
          />
          <div className="min-w-0 flex-1">
            <CommentCompo postId={post.id} />
          </div>

          {/* ✅ Save Button */}
          <button
            onClick={() => toggleSave(post.id)}
            disabled={isSaving}
            className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-gray-400 transition hover:bg-[#2a2a2e] hover:text-yellow-400 disabled:opacity-50 sm:px-3"
          >
            <Bookmark className="h-5 w-5" />
            <span className="hidden text-xs sm:inline">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
