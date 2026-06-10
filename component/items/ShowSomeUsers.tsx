"use client";

import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import { useGetSuggestedUsers } from "@/Query/useUsers";
import { useIsFollowing, useToggleFollow } from "@/Query/useFollow";

// ─── Follow Button منفصل عشان كل user عنده hook خاص ────────────────────────

const FollowButton = ({ userId }: { userId: number }) => {
  const { data: followData, isLoading } = useIsFollowing(userId);
  const { mutate: toggleFollow, isPending } = useToggleFollow(userId);

  return (
    <button
      onClick={() => toggleFollow()}
      disabled={isPending || isLoading}
      className={`mt-2 px-4 py-1 rounded-full text-xs transition disabled:opacity-50 ${
        followData?.isFollowing
          ? "border border-gray-600 text-gray-400"
          : "bg-purple-600 text-white hover:bg-purple-700"
      }`}
    >
      {isPending ? "follo.." : followData?.isFollowing ? "Following" : "Follow"}
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ShowSomeUsers = () => {
  const { data: users = [], isLoading, error } = useGetSuggestedUsers();

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 150,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
    ],
  };

  if (isLoading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-400">Error loading users</div>;
  if (users.length === 0) return null;

  return (
    <div className="mx-2">
      <p className="text-[14px] text-gray-300 mb-3">People may know them</p>

      <div className="mb-6">
        <Slider {...settings}>
          {users.map((user) => (
            <div key={user.id} className="p-2">
              <div className="bg-[#1E1E22] border border-gray-700 rounded-xl p-3 flex flex-col items-center">
                <Link href={`/OuherProfile/${user.id}`}>
                  <div className="w-12 h-12 relative mb-2">
                    {user.profile_image ? ( // ✅ profile_image بدل avatar_url
                      <Image
                        src={user.profile_image}
                        alt="avatar"
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-blue-700 flex items-center justify-center">
                        <p className="text-white text-xs font-bold">
                          {user.username.slice(0, 2).toUpperCase()}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>

                <p className="text-white text-sm truncate max-w-[80px] text-center">
                  {user.username}
                </p>

                {/* ✅ FollowButton منفصل — كل user عنده useIsFollowing خاص بيه */}
                <FollowButton userId={user.id} />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ShowSomeUsers;
