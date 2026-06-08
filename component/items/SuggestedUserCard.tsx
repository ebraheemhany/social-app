"use client";

import { useIsFollowing, useToggleFollow } from "@/Query/useFollow";
import Image from "next/image";
import Link from "next/link";

interface User {
  id: number;
  username: string;
  email: string;
  profile_image?: string | null; // ✅ بدل avatar_url
}

export const SuggestedUserCard = ({ user }: { user: User }) => {
  const { data: followData, isLoading: followLoading } = useIsFollowing(
    user.id,
  );
  const { mutate: toggleFollow, isPending } = useToggleFollow(user.id);

  return (
    <div className="flex items-center justify-between mt-3">
      {/* User Info */}
      <Link href={`/OuherProfile/${user.id}`}>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-[13px] overflow-hidden">
            {user.profile_image ? (
              <div className="w-full h-full relative">
                <Image
                  src={user.profile_image}
                  alt={user.username}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <p>{user.username.slice(0, 2).toUpperCase()}</p>
            )}
          </div>

          <div>
            <p className="text-[14px] text-white truncate max-w-[200px]">
              {user.username.length >= 11
                ? `${user.username.slice(0, 11)}...`
                : user.username}
            </p>
            <p className="text-gray-500 text-[10px]">
              @{user.email.split("@")[0]}
            </p>
          </div>
        </div>
      </Link>

      {/* Follow Button */}
      <button
        onClick={() => toggleFollow()}
        disabled={isPending || followLoading}
        className={`border rounded-2xl text-center w-[80px] py-1 text-[12px] transition cursor-pointer ${
          followData?.isFollowing
            ? "bg-blue-700 text-white border-blue-700"
            : "border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
        }`}
      >
        {isPending
          ? "Follo.."
          : followData?.isFollowing
            ? "Following"
            : "Follow"}
      </button>
    </div>
  );
};
