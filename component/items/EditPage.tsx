// component/items/EditPage.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useUpdateProfile } from "@/Query/useUpdateProfile";
import Image from "next/image";
import { X } from "lucide-react";
import { useUser } from "@/context/UserContext";
const editSchema = z.object({
  username: z.string().min(2).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  bio: z.string().max(150).optional().or(z.literal("")),
  password: z.string().min(6).optional().or(z.literal("")),
});

type EditData = z.infer<typeof editSchema>;

type Props = {
  state: (val: boolean) => void;
  onProfileUpdated: () => void;
};

export const EditPage = ({ state, onProfileUpdated }: Props) => {
  const { user, setUser } = useUser();
  const [preview, setPreview] = useState<string | null>(
    user?.profile_image || null,
  );
  const [file, setFile] = useState<File | null>(null);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  console.log("user data  => ", user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const onSubmit = (data: EditData) => {
    const formData = new FormData();
    if (data.username) formData.append("username", data.username);
    if (data.email) formData.append("email", data.email);
    if (data.bio) formData.append("bio", data.bio);
    if (data.password) formData.append("password", data.password);
    if (file) formData.append("profile_image", file);

    updateProfile(formData, {
      onSuccess: (updatedUser) => {
        // حدّث الـ Context بالبيانات الجديدة من الـ backend
        setUser({
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          bio: updatedUser.bio,
          profile_image: updatedUser.profile_image,
        });
        toast.success("Profile updated successfully");
        onProfileUpdated();
        state(false);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Update failed");
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#0f0f0f] border border-gray-800 rounded-2xl p-6 w-full max-w-md relative">
        {/* Close */}
        <button
          onClick={() => state(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-white text-xl font-bold mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700">
              {preview ? (
                <Image
                  src={preview}
                  alt="preview"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Photo
                </div>
              )}
            </div>
            <label className="text-purple-400 text-sm cursor-pointer hover:text-purple-300">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Username */}
          <input
            {...register("username")}
            placeholder="Username"
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500"
          />

          {/* Email */}
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500"
          />

          {/* Bio */}
          <textarea
            {...register("bio")}
            placeholder="Bio"
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500 resize-none"
          />

          {/* Password */}
          <input
            {...register("password")}
            type="password"
            placeholder="New Password (optional)"
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold disabled:opacity-70"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};
