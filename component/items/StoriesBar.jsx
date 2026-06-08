"use client";
import { useState } from "react";
import Image from "next/image";
import { useGetStories, useCreateStory } from "@/Query/useStories";
import AddStoryModal from "./AddStoryModal";
import StoryViewer from "./StoryViewer";
import { useUser } from "@/context/UserContext";

export default function StoriesBar() {
  const [viewed, setViewed] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(null);

  const { mutate: createStory, isPending: isAdding } = useCreateStory();
  const { data: groupedStories, isPending, error } = useGetStories();
  const { user } = useUser();

  const handleView = (index) => {
    setViewerIndex(index);
    if (groupedStories) {
      setViewed((prev) => ({ ...prev, [groupedStories[index].user_id]: true }));
    }
  };

  const handlePost = (formData) => {
    createStory(formData, { onSuccess: () => setShowModal(false) });
  };

  if (isPending) {
    return (
      <div className="w-[97%] mx-auto rounded-2xl bg-[#1E1E22] flex items-center gap-5 px-3 py-3 sm:rounded-2xl border border-gray-700">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-[38px] h-[38px] sm:w-[58px] sm:h-[58px] rounded-full bg-[#2a2a3e] animate-pulse" />
            <div className="w-10 h-2 rounded bg-[#2a2a3e] animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#1E1E22] flex items-center justify-center px-3 py-4 sm:rounded-2xl border border-gray-700">
        <span className="text-red-400 text-sm">Failed to load stories</span>
      </div>
    );
  }

  return (
    <>
      <div
        className="w-[97%] mx-auto rounded-2xl py-2  bg-[#1E1E22] flex items-center gap-5 px-3  
       font-sans overflow-x-auto sm:rounded-2xl border border-gray-700 custom-scroll"
      >
        {/* Your Story */}
        <div
          className="flex flex-col items-center gap-1 cursor-pointer shrink-0 "
          onClick={() => setShowModal(true)}
        >
          <div className="w-[48px] h-[48px] sm:w-[58px] sm:h-[58px] rounded-full border-2 border-[#555] bg-[#2a2a3e] flex items-center justify-center overflow-hidden relative">
            {user?.profile_image && (
              <Image
                src={user.profile_image}
                alt="avatar"
                fill
                className="object-cover rounded-full"
              />
            )}
            <div className="absolute bottom-0 right-1 w-[18px] h-[18px] bg-blue-500 rounded-full border-2 border-[#1E1E22] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold leading-none">
                +
              </span>
            </div>
          </div>
        </div>

        {/* Stories */}
        {groupedStories?.map((group, index) => {
          const allViewed =
            viewed[group.user_id] || group.stories.every((s) => s.is_viewed);

          return (
            <div
              key={group.user_id}
              className="flex flex-col items-center gap-1 cursor-pointer shrink-0 sm:mt-6  "
              onClick={() => handleView(index)}
            >
              <div
                className="flex items-center justify-center  rounded-full transition-transform duration-150 hover:scale-110 mt-4 sm:mt-0 "
                style={{
                  background: allViewed
                    ? "linear-gradient(135deg, #555, #888)"
                    : "linear-gradient(135deg, #E8733A, #E8733Acc)",
                }}
              >
                <div
                  className="w-[48px] h-[48px] sm:w-[58px] sm:h-[58px] rounded-full border-[3px] border-[#1a1a2e]   
                flex items-center justify-center bg-[#2a2a3e] overflow-hidden relative "
                >
                  {group.profile_image ? (
                    <Image
                      src={group.profile_image}
                      alt="avatar"
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white font-bold text-[18px] sm:text-[20px]">
                      {group.username?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[#ccc] text-[11px] text-center max-w-[60px] truncate">
                {group.username}
              </span>
            </div>
          );
        })}
      </div>

      {showModal && (
        <AddStoryModal
          onClose={() => setShowModal(false)}
          onPost={handlePost}
          isPosting={isAdding}
          profile={user}
        />
      )}

      {viewerIndex !== null &&
        groupedStories &&
        groupedStories[viewerIndex] && (
          <StoryViewer
            stories={groupedStories[viewerIndex].stories}
            ownerUserId={groupedStories[viewerIndex].user_id}
            ownerUsername={groupedStories[viewerIndex].username} // ✅
            ownerProfileImage={groupedStories[viewerIndex].profile_image} // ✅
            startIndex={0}
            onClose={() => setViewerIndex(null)}
          />
        )}
    </>
  );
}
