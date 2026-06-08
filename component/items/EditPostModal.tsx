// component/items/EditPostModal.tsx
"use client";

import { useState } from "react";
import { X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useUpdatePost } from "@/Query/useUpdatePost";

type Post = {
  id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
};

type Props = {
  post: Post;
  onClose: () => void;
};

export const EditPostModal = ({ post, onClose }: Props) => {
  const [content, setContent] = useState(post.content || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(post.media_url);
  const { mutate: updatePost, isPending } = useUpdatePost();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = () => {
    if (!content && !file && !post.media_url) {
      toast.error("Post cannot be empty");
      return;
    }

    const formData = new FormData();
    if (content) formData.append("content", content);
    if (file) formData.append("media", file);

    updatePost(
      { postId: post.id, formData },
      {
        onSuccess: () => {
          toast.success("Post updated successfully");
          onClose();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to update post");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-bold">Edit Post</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-purple-500 resize-none"
        />

        {/* Media Preview */}
        {preview && (
          <div className="relative mt-3 rounded-xl overflow-hidden">
            {post.media_type === "video" && !file ? (
              <video
                src={preview}
                className="w-full max-h-48 object-cover rounded-xl"
                controls
              />
            ) : (
              <Image
                src={preview}
                alt="preview"
                width={400}
                height={200}
                className="w-full max-h-48 object-cover rounded-xl"
              />
            )}
            <button
              onClick={() => {
                setPreview(null);
                setFile(null);
              }}
              className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center gap-2 text-gray-400 hover:text-green-400 cursor-pointer transition text-sm">
            <ImageIcon className="w-5 h-5 text-green-400" />
            Change Media
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold disabled:opacity-70 text-sm"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
