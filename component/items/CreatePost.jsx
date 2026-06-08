"use client";
import { useState, useRef } from "react";
import { ImageIcon, Video, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { useCreatePost } from "@/Query/useAddPost";

export default function CreatePost({ onPostCreated }) {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { mutate: createPost, isPending } = useCreatePost();
  const { user } = useUser();

  const imageRef = useRef(null);
  const videoRef = useRef(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "video" && file.size > 50 * 1024 * 1024) {
      toast.error("Video must be less than 50MB");
      return;
    }
    setMediaPreview({ url: URL.createObjectURL(file), type, file });
  };

  const handleSubmit = () => {
    if (!text.trim() && !mediaPreview) return;

    const formData = new FormData();
    if (text) formData.append("content", text);
    if (mediaPreview?.file) formData.append("media", mediaPreview.file);

    createPost(
      { formData, onProgress: setUploadProgress },
      {
        onSuccess: () => {
          toast.success("Post created successfully");
          setText("");
          setMediaPreview(null);
          setUploadProgress(0);
          onPostCreated?.();
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || "Failed to create post");
          setUploadProgress(0);
        },
      },
    );
  };

  return (
    <div className="w-[97%] mx-auto rounded-2xl bg-[#1E1E22] mt-3 sm:mt-8 sm:rounded-2xl border border-gray-700 px-4 py-3 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-blue-700 flex items-center justify-center">
            {user?.profile_image ? (
              <Image
                src={user.profile_image}
                alt="Avatar"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-[12px] sm:text-[18px] sm:font-bold">
                {user?.username?.slice(0, 2) || ""}
              </span>
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1e1e2e]" />
        </div>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`What's on your mind, ${user?.username}?`}
          className="flex-1 bg-[#2a2a3e] text-gray-300 placeholder-gray-500 text-[12px] sm:text-[16px] rounded-full px-2 sm:px-4 py-1.5 sm:py-2.5 outline-none border border-transparent focus:border-violet-500 transition-colors duration-200"
        />
      </div>

      {/* Preview */}
      {mediaPreview && (
        <div className="relative w-fit">
          {mediaPreview.type === "image" ? (
            <Image
              src={mediaPreview.url}
              alt="preview"
              className="max-h-60 rounded-xl object-cover"
              width={400}
              height={300}
            />
          ) : (
            <video
              src={mediaPreview.url}
              controls
              className="max-h-60 rounded-xl"
            />
          )}
          <button
            onClick={() => setMediaPreview(null)}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {isPending && uploadProgress > 0 && (
        <div className="w-full flex flex-col gap-1">
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{uploadProgress}%</span>
        </div>
      )}

      <div className="border-t border-gray-700/60" />

      <div className="flex items-center justify-between">
        <div className="grid grid-cols-3 sm:flex items-center gap-3 sm:gap-5">
          {/* Image */}
          <button
            onClick={() => imageRef.current?.click()}
            className="flex items-center gap-1.5 text-gray-400 hover:text-green-400 transition-colors duration-150 text-sm"
          >
            <ImageIcon size={18} className="text-green-400" />
            <span>Photo</span>
          </button>
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, "image")}
          />

          {/* Video */}
          <button
            onClick={() => videoRef.current?.click()}
            className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors duration-150 text-sm"
          >
            <Video size={18} className="text-red-400" />
            <span>Video</span>
          </button>
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, "video")}
          />

          {/* Post button */}
          <button
            onClick={handleSubmit}
            disabled={isPending || (!text.trim() && !mediaPreview)}
            className="bg-blue-700 hover:bg-blue-800 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm text-center font-semibold sm:px-5 py-2 rounded-full transition-all duration-150"
          >
            {isPending
              ? `${uploadProgress > 0 ? uploadProgress + "%" : "Posting..."}`
              : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
