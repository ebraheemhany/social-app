"use client";

import { Heart } from "lucide-react";
import { useToggleLike } from "@/Query/useLikes";
import { useQueryClient } from "@tanstack/react-query";
import { POSTS_KEY, Post } from "@/Query/useGetAllPosts";
import { useUser } from "@/context/UserContext";

const LikesCompo = ({
  postId,
  isLiked,
  likesCount,
}: {
  postId: number;
  isLiked: boolean;
  likesCount: number;
}) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const currentUserId = user ? Number(user.id) : 0;
  const { mutate: toggleLike, isPending } = useToggleLike(
    postId,
    currentUserId,
  );

  const handleClick = () => {
    if (!user) return;

    // ✅ Optimistic update على الـ posts list
    queryClient.setQueryData<Post[]>(POSTS_KEY, (old) =>
      (old ?? []).map((p) =>
        p.id === postId
          ? {
              ...p,
              is_liked: !p.is_liked,
              likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1,
            }
          : p,
      ),
    );

    toggleLike(undefined, {
      onError: () => {
        // ✅ rollback لو فشل
        queryClient.invalidateQueries({ queryKey: POSTS_KEY });
      },
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={!user || isPending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] transition ${
        !user
          ? "text-gray-500 cursor-not-allowed"
          : isLiked
            ? "text-red-500"
            : "text-gray-400"
      }`}
    >
      <Heart
        size={16}
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
      />
      {likesCount}
    </button>
  );
};

export default LikesCompo;
