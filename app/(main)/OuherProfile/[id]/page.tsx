"use client";

import { useParams, useRouter } from "next/navigation";
import LeftSection from "@/component/leftSection/leftSection";
import RighteSection from "@/component/righteSection/righteSection";
import Image from "next/image";
import { toast } from "sonner";
import {
  useGetFollowStats,
  useIsFollowing,
  useToggleFollow,
} from "@/Query/useFollow";
import { useGetOrCreateConversation } from "@/Query/useChat";
import { useGetCurrentUser, useGetUserPosts } from "@/Query/useGetUserByid";

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const userId = Array.isArray(id) ? (id[0] ?? "") : (id ?? "");
  const userIdNumber = Number(userId);

  // ─── Data ──────────────────────────────────────────────────────────────────
  const { data: profileData, isLoading: profileLoading } =
    useGetCurrentUser(userId);
  const profile = profileData?.profile ?? null;

  const { data: userPosts = [], isLoading: postsLoading } =
    useGetUserPosts(userId);
  const { data: followStats } = useGetFollowStats(
    Number.isNaN(userIdNumber) ? 0 : userIdNumber,
  );
  const { data: followData, isLoading: followLoading } = useIsFollowing(
    Number.isNaN(userIdNumber) ? 0 : userIdNumber,
  );
  const { mutate: toggleFollow, isPending: followPending } = useToggleFollow(
    Number.isNaN(userIdNumber) ? 0 : userIdNumber,
  );
  const { mutate: getOrCreateConv, isPending: isLoadingMessage } =
    useGetOrCreateConversation();

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleSendMessage = () => {
    if (Number.isNaN(userIdNumber)) {
      toast.error("Invalid user ID");
      return;
    }

    getOrCreateConv(userIdNumber, {
      onSuccess: (conv) => {
        router.push(`/Messages?conv=${conv.id}`);
      },
      onError: () => {
        toast.error("Failed to start conversation");
      },
    });
  };

  if (profileLoading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

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
          <div className="w-full md:w-[70%] lg:w-[60%] mt-22 md:mt-10 bg-black text-white min-h-screen flex flex-col">
            {/* Profile Header */}
            <div className="relative flex flex-col items-center justify-between sm:flex-row sm:items-start mx-3 md:mx-0 py-6">
              <div>
                {profile?.profile_image ? (
                  <Image
                    src={profile.profile_image}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="rounded-full object-cover w-24 h-24"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center text-2xl shadow-[0_0_10px_#1d4ed8]">
                    {profile?.username?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <h2 className="mt-3 text-[18px] font-semibold">
                  {profile?.username}
                </h2>
                <p className="text-gray-400 text-[12px]">{profile?.email}</p>
                <p className="text-gray-400 text-[12px] mt-1 max-w-xs">
                  {profile?.bio || "No bio available"}
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-4 text-center">
                <div>
                  <p className="font-bold text-lg">{userPosts.length}</p>
                  <p className="text-gray-400 text-sm">Posts</p>
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {followStats?.followers ?? 0}
                  </p>
                  <p className="text-gray-400 text-sm">Followers</p>
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {followStats?.following ?? 0}
                  </p>
                  <p className="text-gray-400 text-sm">Following</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => toggleFollow()}
                  disabled={followPending || followLoading}
                  className={`px-4 py-1 text-center border cursor-pointer text-[15px] rounded-2xl transition disabled:opacity-50 ${
                    followData?.isFollowing
                      ? "bg-blue-700 text-white border-blue-700"
                      : "border-blue-700 text-white hover:bg-blue-700"
                  }`}
                >
                  {followPending
                    ? "..."
                    : followData?.isFollowing
                      ? "Following"
                      : "Follow"}
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={isLoadingMessage}
                  className="px-4 py-1 text-center border border-blue-700 text-white hover:bg-blue-700 cursor-pointer text-[15px] rounded-2xl transition disabled:opacity-50"
                >
                  {isLoadingMessage ? "..." : "Message"}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-around border-b border-gray-800">
              <button className="py-3 border-b-2 border-purple-500 text-purple-400">
                Posts
              </button>
              <button className="py-3 text-gray-400">Bookmark</button>
              <button className="py-3 text-gray-400">Tag</button>
            </div>

            {/* Posts Grid */}
            {postsLoading ? (
              <div className="grid grid-cols-3 gap-1 mt-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-800 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 mt-2">
                {userPosts.length === 0 ? (
                  <div className="col-span-3 text-center text-gray-500 py-10">
                    No posts yet
                  </div>
                ) : (
                  userPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => router.push(`/posts/${post.id}`)}
                      className="aspect-square bg-gray-800 overflow-hidden relative cursor-pointer group"
                    >
                      {post.media_type === "image" ? (
                        <Image
                          src={post.media_url!}
                          alt="post"
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : post.media_type === "video" ? (
                        <video
                          src={post.media_url!}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-2">
                          <p className="text-gray-300 text-xs text-center line-clamp-4">
                            {post.content}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
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
