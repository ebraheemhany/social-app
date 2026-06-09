"use client";

import LeftSection from "../../../component/leftSection/leftSection";
import RighteSection from "../../../component/righteSection/righteSection";
import { EditPage } from "@/component/items/EditPage";
import { useState } from "react";
import Image from "next/image";
import { useGetUserPosts } from "@/Query/useGetUserByid";
import { useGetFollowStats } from "@/Query/useFollow";
import { useUser } from "@/context/UserContext";
import { UserPen, Trash2, Pencil, Eye } from "lucide-react";
import { useDeletePostByID } from "@/Query/useDeletePostByID";
import { toast } from "sonner";
import { EditPostModal } from "@/component/items/EditPostModal";

type Post = {
  id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
};

const PostsSkeleton = () => (
  <div className="grid grid-cols-3 gap-1">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="aspect-square bg-gray-800 animate-pulse" />
    ))}
  </div>
);

export default function ProfilePage() {
  const [showEdit, setShowEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const { user } = useUser();
  const { mutate: deletePost, isPending } = useDeletePostByID();

  const { data: userPosts = [], isLoading: postsLoading } = useGetUserPosts(
    user?.id ?? "",
  );

  const { data: followStats } = useGetFollowStats(Number(user?.id) ?? 0);

  const handleDelete = () => {
    if (!postToDelete) return;
    deletePost(postToDelete, {
      onSuccess: () => {
        toast.success("Post deleted");
        setPostToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete post");
        setPostToDelete(null);
      },
    });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-[95%] lg:w-[90%] relative bg-black text-white">
        <div className="flex gap-4">
          <div className="hidden md:block md:w-[30%] lg:w-[20%]">
            <div className="fixed top-0 h-screen md:w-[25%] lg:w-[16%]">
              <LeftSection />
            </div>
          </div>

          <div className="w-full md:w-[70%] lg:w-[60%] mt-20 md:mt-10 bg-black text-white min-h-screen flex flex-col">
            {!user ? (
              <div className="text-center text-yellow-500 py-10">
                No user data found
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-between sm:flex-row sm:items-start mx-3 md:mx-0 py-6">
                <div>
                  {user?.profile_image ? (
                    <Image
                      src={user.profile_image}
                      alt="Profile Image"
                      width={96}
                      height={96}
                      className="rounded-full object-cover w-24 h-24"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center text-2xl shadow-[0_0_10px_#1d4ed8]">
                      {user?.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                  <h2 className="mt-3 text-[18px] font-semibold">
                    {user?.username}
                  </h2>
                  <p className="text-gray-400 text-[12px]">{user?.email}</p>
                  <p className="text-gray-400 text-[12px] mt-1 max-w-xs">
                    {user?.bio || "No bio available"}
                  </p>
                </div>

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

                <div
                  onClick={() => setShowEdit(true)}
                  className="hidden sm:block mt-5 w-28 h-8 text-center border border-blue-700 cursor-pointer pt-1 text-[15px] text-white rounded-2xl hover:bg-blue-700 transition"
                >
                  Edit Profile
                </div>

                <div
                  onClick={() => setShowEdit(true)}
                  className="block sm:hidden absolute top-3 right-3 cursor-pointer"
                >
                  <UserPen />
                </div>
              </div>
            )}

            <div className="flex justify-around border-b border-gray-800">
              {["posts", "bookmark", "tag"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 capitalize transition ${
                    activeTab === tab
                      ? "border-b-2 border-purple-500 text-purple-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {postsLoading ? (
              <PostsSkeleton />
            ) : (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {userPosts.length === 0 ? (
                  <div className="col-span-3 text-center text-gray-500 py-10">
                    No posts yet
                  </div>
                ) : (
                  userPosts.map((post: Post) => (
                    <div
                      key={post.id}
                      className="aspect-square bg-gray-800 overflow-hidden relative group cursor-pointer"
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
                        <div className="w-full h-full flex items-center justify-center p-2 group-hover:bg-gray-700 transition">
                          <p className="text-gray-300 text-xs text-center line-clamp-4">
                            {post.content}
                          </p>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-end justify-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPost(post);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition mr-1 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPost(post);
                          }}
                          className="bg-blue-800 hover:bg-blue-950 text-gray-400 p-2 rounded-full transition mr-1 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPostToDelete(post.id);
                          }}
                          className="bg-red-800 hover:bg-red-950 text-gray-400 p-2 rounded-full transition mr-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="w-[20%] hidden lg:block">
            <div className="fixed top-0 w-[16%]">
              <RighteSection />
            </div>
          </div>
        </div>
      </div>

      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-zinc-900 p-4 rounded-xl w-[90%] max-w-2xl h-[70%]"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedPost.media_type === "image" && (
              <Image
                src={selectedPost.media_url!}
                alt="post"
                width={600}
                height={400}
                className="w-full h-full rounded-lg"
              />
            )}
            {selectedPost.media_type === "video" && (
              <video
                src={selectedPost.media_url!}
                controls
                className="w-full rounded-lg h-full"
              />
            )}
            <p className="mt-4 text-white">{selectedPost.content}</p>
          </div>
        </div>
      )}

      {postToDelete && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPostToDelete(null)}
        >
          <div
            className="bg-gray-900 border border-zinc-700 rounded-xl p-6 w-[90%] max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-white">Delete Post</h2>
            <p className="text-gray-400 mt-2">
              Are you sure you want to delete this post?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isPending}
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-950 cursor-pointer transition disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
        />
      )}

      {showEdit && <EditPage state={setShowEdit} />}
    </div>
  );
}
