"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function AddStoryModal({ onClose, onPost, isPosting, profile }) {
  const [step, setStep] = useState("choose");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [textBg, setTextBg] = useState(
    "linear-gradient(135deg,#667eea,#764ba2)",
  );
  const fileRef = useRef();

  const bgs = [
    "linear-gradient(135deg,#667eea,#764ba2)",
    "linear-gradient(135deg,#f093fb,#f5576c)",
    "linear-gradient(135deg,#4facfe,#00f2fe)",
    "linear-gradient(135deg,#43e97b,#38f9d7)",
    "linear-gradient(135deg,#fa709a,#fee140)",
    "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  ];

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleChooseFile = (type) => {
    fileRef.current.accept = type === "image" ? "image/*" : "video/*";
    fileRef.current.value = "";
    setStep(type);
    fileRef.current.click();
  };

  const handlePost = () => {
    const formData = new FormData();

    if (step === "text") {
      formData.append("textContent", textContent);
      formData.append("backgroundColor", textBg);
    } else {
      formData.append("media", file); // ✅ نفس اسم الـ field في الـ backend
    }

    onPost(formData);
  };

  const canPost =
    (step === "text" && textContent.trim()) ||
    ((step === "image" || step === "video") && file);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="bg-[#1E1E22] rounded-2xl border border-gray-700 w-[340px] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <button
            onClick={
              step === "choose"
                ? onClose
                : () => {
                    setStep("choose");
                    setPreview(null);
                    setFile(null);
                  }
            }
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            {step === "choose" ? "cancel" : "← back"}
          </button>
          <span className="text-white text-sm font-medium">new Story</span>
          <div className="flex items-center gap-2">
            {profile?.profile_image ? ( // ✅ profile_image بدل avatar_url
              <Image
                src={profile.profile_image}
                alt="avatar"
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {profile?.username?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-gray-400 text-xs">{profile?.username}</span>
          </div>
        </div>

        {/* Step 1 — اختر النوع */}
        {step === "choose" && (
          <div className="p-5 flex flex-col gap-3">
            <p className="text-gray-400 text-xs text-center mb-1">
              Choose Story Type
            </p>

            <button
              onClick={() => handleChooseFile("image")}
              className="flex items-center gap-3 bg-[#2a2a3e] hover:bg-[#33334a] transition-colors rounded-xl px-4 py-3"
            >
              <span className="text-2xl">🖼️</span>
              <div className="text-left">
                <p className="text-white text-sm font-medium">Image</p>
                <p className="text-gray-500 text-xs">
                  Upload an image from your device
                </p>
              </div>
            </button>

            <button
              onClick={() => handleChooseFile("video")}
              className="flex items-center gap-3 bg-[#2a2a3e] hover:bg-[#33334a] transition-colors rounded-xl px-4 py-3"
            >
              <span className="text-2xl">🎬</span>
              <div className="text-left">
                <p className="text-white text-sm font-medium">Video</p>
                <p className="text-gray-500 text-xs">
                  Upload a video from your device
                </p>
              </div>
            </button>

            <button
              onClick={() => setStep("text")}
              className="flex items-center gap-3 bg-[#2a2a3e] hover:bg-[#33334a] transition-colors rounded-xl px-4 py-3"
            >
              <span className="text-2xl">✍️</span>
              <div className="text-left">
                <p className="text-white text-sm font-medium">Text</p>
                <p className="text-gray-500 text-xs">Write a text story</p>
              </div>
            </button>
          </div>
        )}

        {/* Step 2 — معاينة صورة / فيديو */}
        {(step === "image" || step === "video") && (
          <div className="p-4 flex flex-col gap-4">
            {preview ? (
              <div className="relative w-full h-[380px] rounded-xl overflow-hidden bg-black">
                {step === "image" ? (
                  <Image
                    src={preview}
                    alt="preview"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
                <button
                  onClick={() => {
                    setPreview(null);
                    setFile(null);
                  }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current.click()}
                className="w-full h-[200px] rounded-xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-gray-400 hover:text-gray-300 transition-colors"
              >
                <span className="text-3xl">
                  {step === "image" ? "🖼️" : "🎬"}
                </span>
                <span className="text-sm">
                  Click to choose {step === "image" ? "image" : "video"}
                </span>
              </button>
            )}
          </div>
        )}

        {/* Step 2 — نص */}
        {step === "text" && (
          <div className="p-4 flex flex-col gap-4">
            <div
              className="w-full h-[200px] rounded-xl flex items-center justify-center p-4"
              style={{ background: textBg }}
            >
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="write your story..."
                maxLength={150}
                className="bg-transparent text-white text-center text-lg font-medium placeholder-white/60 resize-none outline-none w-full h-full"
              />
            </div>
            <div className="flex gap-2 justify-center">
              {bgs.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setTextBg(bg)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    textBg === bg
                      ? "border-white scale-110"
                      : "border-transparent"
                  }`}
                  style={{ background: bg }}
                />
              ))}
            </div>
            <p className="text-gray-600 text-xs text-center">
              {textContent.length}/150
            </p>
          </div>
        )}

        {/* Footer */}
        {step !== "choose" && (
          <div className="px-4 pb-4">
            <button
              onClick={handlePost}
              disabled={!canPost || isPosting}
              className="w-full py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:
                  canPost && !isPosting
                    ? "linear-gradient(135deg,#667eea,#764ba2)"
                    : undefined,
                color: "white",
                backgroundColor: !canPost || isPosting ? "#2a2a3e" : undefined,
              }}
            >
              {isPosting ? "Posting..." : "Post Story ✨"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
