"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useDeleteStory, useGetStoryViews } from "@/Query/useStories";
import { useUser } from "@/context/UserContext";
import { Numans } from "next/font/google";

export default function StoryViewer({
  stories,
  startIndex = 0,
  onClose,
  ownerUserId,
  ownerUsername,
  ownerProfileImage,
}) {
  const [currentIdx, setCurrentIdx] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);
  const progressRef = useRef(0);
  const isDoneRef = useRef(false);
  const DURATION = 5000;

  const currentStory = stories[currentIdx];
  const { user } = useUser();
  const { mutate: deleteStory, isPending: isDeleting } = useDeleteStory();
  const isOwner = Number(user?.id) === ownerUserId;

  // ✅ جيب المشاهدين بس لو صاحب الـ story وفتح الـ viewers panel
  const { data: viewsData, isLoading: viewsLoading } = useGetStoryViews(
    currentStory?.id,
    isOwner && showViewers,
  );

  const nextStory = useCallback(() => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;
    cancelAnimationFrame(animRef.current);
    if (currentIdx < stories.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setTimeout(() => onClose(), 0);
    }
  }, [currentIdx, stories.length, onClose]);

  const prevStory = useCallback(() => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;
    cancelAnimationFrame(animRef.current);
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  useEffect(() => {
    isDoneRef.current = false;
    progressRef.current = 0;
    lastTimeRef.current = null;
    setProgress(0);
    setShowOptions(false);
    setShowViewers(false);

    const tick = (ts) => {
      if (isDoneRef.current) return;
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const delta = ts - lastTimeRef.current;
      lastTimeRef.current = ts;
      progressRef.current += (delta / DURATION) * 100;
      if (progressRef.current >= 100) {
        setProgress(100);
        nextStory();
        return;
      }
      setProgress(progressRef.current);
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [currentIdx, nextStory]);

  const handleDelete = () => {
    deleteStory(currentStory.id, {
      onSuccess: () => {
        if (stories.length > 1) {
          if (currentIdx < stories.length - 1) {
            setCurrentIdx((prev) => prev + 1);
          } else {
            setCurrentIdx((prev) => prev - 1);
          }
        } else {
          onClose();
        }
        setShowOptions(false);
      },
    });
  };

  if (!currentStory) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-[90%] h-[350px]  sm:w-[340px] sm:h-[600px] rounded-2xl overflow-hidden bg-black">
        {/* Background */}
        {currentStory.media_url ? (
          currentStory.media_type === "video" ? (
            <video
              src={currentStory.media_url}
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={currentStory.media_url}
              alt="story"
              fill
              className="object-cover"
            />
          )
        ) : (
          <div
            className="w-full h-full flex items-center justify-center p-8"
            style={{
              background:
                currentStory.background_color ||
                "linear-gradient(135deg,#667eea,#764ba2)",
            }}
          >
            <p className="text-white text-xl font-medium text-center leading-relaxed break-words whitespace-pre-wrap w-full">
              {currentStory.text_content}
            </p>
          </div>
        )}

        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-10">
          {stories.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white rounded-full"
                style={{
                  width:
                    i < currentIdx
                      ? "100%"
                      : i === currentIdx
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-7 left-3 right-3 flex items-center gap-2 z-20">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50 relative flex-shrink-0">
            {ownerProfileImage ? (
              <Image
                src={ownerProfileImage}
                alt="avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold bg-blue-600">
                {ownerUsername?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-white text-sm font-medium">
              {currentStory.username}
            </p>
            <p className="text-white/60 text-xs">
              {new Date(currentStory.created_at).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowOptions((v) => !v)}
                  className="text-white/80 hover:text-white w-8 h-8 flex items-center justify-center text-lg"
                >
                  ⋯
                </button>

                {showOptions && (
                  <div className="absolute top-9 right-0 bg-[#1E1E22] border border-gray-700 rounded-xl overflow-hidden shadow-xl w-36 z-30">
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full px-4 py-3 text-sm text-red-400 hover:bg-[#2a2a3e] transition text-left disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "🗑 Delete Story"}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xl w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tap Areas */}
        <button
          className="absolute left-0 top-0 w-1/3 h-full z-10"
          onClick={prevStory}
        />
        <button
          className="absolute right-0 top-0 w-1/3 h-full z-10"
          onClick={nextStory}
        />

        {/* ✅ Viewers Button — بس لو صاحب الـ story */}
        {isOwner && (
          <button
            onClick={() => setShowViewers((v) => !v)}
            className="absolute bottom-16 left-3 right-3 z-20 flex items-center gap-2 text-white/70 hover:text-white text-sm transition"
          >
            <span>👁</span>
            <span>{viewsData?.count ?? 0} views</span>
          </button>
        )}

        {/* ✅ Viewers Panel */}
        {isOwner && showViewers && (
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-[#1E1E22]/95 backdrop-blur rounded-t-2xl p-4 max-h-[60%] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium text-sm">
                👁 {viewsData?.count ?? 0} Viewers
              </h3>
              <button
                onClick={() => setShowViewers(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {viewsLoading ? (
              <div className="flex flex-col gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-xl bg-[#2a2a3e] animate-pulse"
                  />
                ))}
              </div>
            ) : viewsData?.views.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No views yet
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {viewsData?.views.map((v) => (
                  <div key={v.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 overflow-hidden relative shrink-0 flex items-center justify-center">
                      {v.profile_image ? (
                        <Image
                          src={v.profile_image}
                          alt={v.username}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-white text-xs font-bold">
                          {v.username?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{v.username}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(v.viewed_at).toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="absolute bottom-4 left-1 right-3 sm:left-3 sm:right-3 z-20 flex items-center gap-2">
          <input
            placeholder="إرسال رسالة..."
            className="flex-1 bg-white/10 border border-white/30 rounded-full px-2 sm:px-4 py-2 text-white text-sm placeholder-white/50 outline-none"
          />
          <button className="text-white text-xl">🤍</button>
        </div>
      </div>
    </div>
  );
}
