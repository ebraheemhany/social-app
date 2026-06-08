"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useGetComments,
  useCreateComment,
  useDeleteComment,
  useEditComment,
  Comment,
} from "@/Query/useComments";
import { useUser } from "@/context/UserContext";
import { PencilLine } from "lucide-react";
const CommentCompo = ({ postId }: { postId: number }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const { user } = useUser();

  const { data: comments = [], isLoading, error } = useGetComments(postId);
  const { mutate: createComment, isPending } = useCreateComment(postId);
  const { mutate: deleteComment } = useDeleteComment(postId);
  const { mutate: editComment, isPending: isEditing } = useEditComment(postId);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const submitComment = () => {
    if (!draft.trim() || !user) return;
    createComment(draft.trim(), { onSuccess: () => setDraft("") });
  };

  const startEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditDraft(c.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft("");
  };

  const submitEdit = (commentId: number) => {
    if (!editDraft.trim()) return;
    editComment(
      { commentId, content: editDraft.trim() },
      { onSuccess: cancelEdit },
    );
  };

  const handleKey = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action();
    }
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <div className="w-full relative">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] text-gray-400"
      >
        <CommentIcon />
        تعليق
        {comments.length > 0 && (
          <span className="text-xs text-gray-500">({comments.length})</span>
        )}
      </button>

      {/* Comments Panel */}
      <div
        className="overflow-hidden transition-all duration-300 w-full"
        style={{ maxHeight: open ? "800px" : "0", opacity: open ? 1 : 0 }}
      >
        <div className="px-5 pt-3 flex flex-col gap-2.5">
          {isLoading && <div className="text-gray-400 text-sm">Loading...</div>}
          {error && (
            <div className="text-red-400 text-sm">Error loading comments</div>
          )}

          {!isLoading &&
            !error &&
            comments.map((c: Comment) => (
              <div key={c.id} className="flex items-start gap-3 group">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-blue-600 shrink-0 overflow-hidden flex items-center justify-center">
                  {c.profile_image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={c.profile_image}
                        alt="avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-white font-bold">
                      {c.username?.charAt(0).toUpperCase() ?? "?"}
                    </span>
                  )}
                </div>

                {/* Content أو Edit Input */}
                <div className="bg-gray-700 rounded-xl px-3 py-2 flex-1">
                  <strong className="text-xs text-gray-100 block mb-1">
                    {c.username}
                  </strong>

                  {editingId === c.id ? (
                    // ── Edit Mode ──────────────────────────────────────────
                    <div className="flex flex-col gap-2">
                      <textarea
                        rows={2}
                        value={editDraft}
                        autoFocus
                        onChange={(e) => setEditDraft(e.target.value)}
                        onKeyDown={(e) => handleKey(e, () => submitEdit(c.id))}
                        className="w-full bg-gray-800 text-white rounded-lg p-2 text-sm resize-none outline-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={cancelEdit}
                          className="text-xs text-gray-400 hover:text-white px-3 py-1 rounded-lg bg-gray-600 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => submitEdit(c.id)}
                          disabled={isEditing || !editDraft.trim()}
                          className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg disabled:opacity-50 transition"
                        >
                          {isEditing ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // ── View Mode ──────────────────────────────────────────
                    <p className="text-[13px] text-gray-300">{c.content}</p>
                  )}
                </div>

                {/* Actions — بس لو صاحب التعليق */}
                {Number(user?.id) === c.user_id && editingId !== c.id && (
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition mt-3">
                    <button
                      onClick={() => startEdit(c)}
                      className="text-gray-400 hover:text-blue-400 text-xs cursor-pointer"
                    >
                      <PencilLine size={13} />
                    </button>
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-gray-400 hover:text-red-400 text-xs cursor-pointer "
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* New Comment Input */}
        <div className="px-5 pt-3 pb-4 flex gap-2 items-end w-full">
          <textarea
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => handleKey(e, submitComment)}
            placeholder="Add Comment..."
            className="flex-1 bg-gray-800 text-white rounded-xl p-2 text-sm resize-none outline-none"
          />
          <button
            onClick={submitComment}
            disabled={isPending || !user || !draft.trim()}
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-sm disabled:opacity-50 transition"
          >
            {isPending ? "Adding..." : user ? "Add" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentCompo;

const CommentIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
