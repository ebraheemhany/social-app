"use client";

import { useFollow } from "@/Query/useFollow";
import { useToggleFollow } from "@/Query/useToggleFollow";
import Image from "next/image";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
}

export const SuggestedUserCard = ({ user }: { user: User }) => {
  const { data: followData, isLoading: followLoading } = useFollow(user.id);
  const toggleFollow = useToggleFollow();

  const handleFollow = () => {
    if (!followData) return;

    toggleFollow.mutate({
      profileId: user.id,
      userId: followData.userId,
      isFollowing: followData.isFollowing,
    });
  };

  return (
    <div className="flex items-center justify-between mt-3">
      {/* left section */}
      <Link href={`/OuherProfile/${user.id}`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-[13px] overflow-hidden">
            {user.avatar_url ? (
              <div className="w-full h-full relative">
                <Image
                  src={user.avatar_url}
                  alt="avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <p>{user.username.slice(0, 2)}</p>
            )}
          </div>

          <div>
            <p className="text-[14px] text-white truncate max-w-[200px]">
              {user.username.length >= 11
                ? user.username.slice(0, 11) + "..."
                : user.username}
            </p>
            <p className="text-gray-500 text-[10px]">
              @{user.email.split("@")[0]}
            </p>
          </div>
        </div>
      </Link>

      {/* follow button */}
      <button
        onClick={handleFollow}
        disabled={toggleFollow.isPending || followLoading}
        className={`border rounded-2xl text-center w-[70px] py-1 cursor-pointer text-[12px] ${
          followData?.isFollowing
            ? "bg-blue-700 text-white"
            : "border-blue-700 text-blue-700"
        }`}
      >
        {toggleFollow.isPending
          ? "Foll.."
          : followData?.isFollowing
            ? "Following"
            : "Follow"}
      </button>
    </div>
  );
};
