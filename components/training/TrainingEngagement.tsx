"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  SmilePlus,
  Loader2,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface CommentItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  message: string;
  createdAt: string | Date;
  reactions?: Record<string, number>;
  userReactions?: string[];
}

interface CurrentUser {
  id: string;
  name: string;
  username?: string;
  avatar?: string | null;
  role: string;
}

interface TrainingEngagementProps {
  trainingId: string;
  allowComments?: boolean;
  allowInteractions?: boolean;
  initialStats?: {
    avgRating?: number;
    ratingsCount?: number;
    likesCount?: number;
    commentsCount?: number;
  };
  currentUser: CurrentUser | null;
}

const AVAILABLE_REACTIONS = [
  { emoji: "👍", label: "Thumbs Up" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "👏", label: "Clap" },
  { emoji: "💡", label: "Insightful" },
  { emoji: "🎉", label: "Celebrate" },
];

export function TrainingEngagement({
  trainingId,
  allowComments = true,
  allowInteractions = true,
  initialStats,
  currentUser,
}: TrainingEngagementProps) {
  // Likes state
  const [likesCount, setLikesCount] = useState(initialStats?.likesCount ?? 0);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  // Ratings state
  const [avgRating, setAvgRating] = useState(initialStats?.avgRating ?? 5.0);
  const [totalRatings, setTotalRatings] = useState(initialStats?.ratingsCount ?? 0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submittingRating, setSubmittingRating] = useState(false);

  // Comments state
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [pickerCommentId, setPickerCommentId] = useState<string | null>(null);

  // Fetch initial likes and rating state for user
  useEffect(() => {
    // Fetch likes
    fetch(`/api/training/${trainingId}/like`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setLikesCount(d.count ?? 0);
          setLiked(!!d.liked);
        }
      })
      .catch(() => {});

    // Fetch rating
    fetch(`/api/training/${trainingId}/rate`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          if (d.avgRating) setAvgRating(d.avgRating);
          if (d.totalRatings !== undefined) setTotalRatings(d.totalRatings);
          if (d.userRating) setUserRating(d.userRating);
        }
      })
      .catch(() => {});

    // Fetch comments
    setLoadingComments(true);
    fetch(`/api/training/${trainingId}/comments`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setComments(d.comments || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingComments(false));
  }, [trainingId]);

  // Handle Like
  const handleToggleLike = async () => {
    if (!allowInteractions) {
      toast.error("Interactions are disabled for this training program");
      return;
    }
    if (!currentUser) {
      toast.error("Please sign in to like this training program");
      return;
    }
    setLiking(true);
    try {
      const res = await fetch(`/api/training/${trainingId}/like`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setLiked(data.liked);
        setLikesCount(data.count);
        toast.success(data.liked ? "Liked training program!" : "Removed like");
      } else {
        toast.error(data.error || "Failed to update like");
      }
    } catch {
      toast.error("Failed to like program");
    } finally {
      setLiking(false);
    }
  };

  // Handle Rate
  const handleRate = async (stars: number) => {
    if (!allowInteractions) {
      toast.error("Interactions are disabled for this training program");
      return;
    }
    if (!currentUser) {
      toast.error("Please sign in to rate this training program");
      return;
    }
    setSubmittingRating(true);
    try {
      const res = await fetch(`/api/training/${trainingId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars }),
      });
      const data = await res.json();
      if (data.success) {
        setUserRating(data.userRating);
        setAvgRating(data.avgRating);
        setTotalRatings(data.totalRatings);
        toast.success(`You gave ${stars} star${stars > 1 ? "s" : ""}!`);
      } else {
        toast.error(data.error || "Failed to submit rating");
      }
    } catch {
      toast.error("Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  // Handle Submit Comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowComments) {
      toast.error("Comments are disabled for this training program");
      return;
    }
    if (!currentUser) {
      toast.error("Please sign in to post a comment");
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/training/${trainingId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newComment }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [data.comment, ...prev]);
        setNewComment("");
        toast.success("Comment posted successfully!");
      } else {
        toast.error(data.error || "Failed to post comment");
      }
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle Delete Comment
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`/api/training/${trainingId}/comments?commentId=${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success("Comment deleted");
      } else {
        toast.error(data.error || "Failed to delete comment");
      }
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  // Handle Comment Emoji Reaction
  const handleEmojiReaction = async (commentId: string, emoji: string) => {
    setPickerCommentId(null);
    try {
      const res = await fetch(`/api/training/${trainingId}/comments/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, emoji }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, reactions: data.reactions, userReactions: data.userReactions }
              : c
          )
        );
      }
    } catch {
      // reaction error ignored
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. TOP ENGAGEMENT BAR (RATINGS & LIKES) */}
      {allowInteractions ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Star Rating Section */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-2xl font-black text-[#08245C] dark:text-white">
                {avgRating > 0 ? avgRating.toFixed(1) : "5.0"}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled =
                    hoverRating !== null
                      ? star <= hoverRating
                      : userRating !== null
                      ? star <= userRating
                      : star <= Math.round(avgRating);

                  return (
                    <button
                      key={star}
                      type="button"
                      disabled={submittingRating}
                      onMouseEnter={() => currentUser && setHoverRating(star)}
                      onMouseLeave={() => currentUser && setHoverRating(null)}
                      onClick={() => handleRate(star)}
                      className="p-1 transition transform hover:scale-110 focus:outline-none disabled:cursor-not-allowed"
                      title={currentUser ? `Rate ${star} star${star > 1 ? "s" : ""}` : "Sign in to rate"}
                    >
                      <Star
                        className={`w-6 h-6 transition ${
                          isFilled
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-600 hover:text-amber-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold ml-1">
                ({totalRatings} review{totalRatings === 1 ? "" : "s"})
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentUser ? (
                userRating ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> You rated this {userRating} stars (click to change)
                  </span>
                ) : (
                  "Click on any star above to rate this program (1–5 stars)"
                )
              ) : (
                <span className="text-slate-400 dark:text-slate-500">
                  <Link href="/login" className="text-[#0875D1] dark:text-blue-400 font-bold hover:underline">
                    Sign in
                  </Link>{" "}
                  to give your 1–5 stars rating.
                </span>
              )}
            </p>
          </div>

          {/* Interaction (Like) Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleToggleLike}
              disabled={liking}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-xs transition border shadow-sm ${
                liked
                  ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Heart
                className={`w-4 h-4 transition ${
                  liked ? "fill-rose-500 text-rose-500 scale-110" : "text-slate-400 dark:text-slate-500"
                }`}
              />
              <span>{liked ? "Liked Program" : "Like Program"}</span>
              <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-[11px] font-extrabold text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                {likesCount}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-xl font-bold text-[#08245C] dark:text-white">
                {avgRating > 0 ? avgRating.toFixed(1) : "5.0"}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold ml-1">
                ({totalRatings} review{totalRatings === 1 ? "" : "s"})
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>{likesCount} likes</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <Lock className="w-3.5 h-3.5" />
            Interactions (ratings &amp; likes) are disabled
          </div>
        </div>
      )}

      {/* 2. COMMENTS SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <MessageCircle className="w-5 h-5 text-[#0875D1] dark:text-blue-400" />
            <h3 className="text-xl font-black text-[#08245C] dark:text-white">
              Discussion &amp; Reviews
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-[#0875D1] dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/50">
              {comments.length}
            </span>
          </div>
        </div>

        {/* ADD COMMENT FORM (AUTH GUARDED) OR DISABLED BANNER */}
        {!allowComments ? (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-200/70 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Comments Disabled</p>
              <p className="text-slate-500 dark:text-slate-400">
                Comments and reviews have been closed for this training program.
              </p>
            </div>
          </div>
        ) : currentUser ? (
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-700">
                {currentUser.avatar ? (
                  <Image
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts, ask about the curriculum, or leave a review..."
                  rows={3}
                  maxLength={1000}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800 transition resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {newComment.length}/1000 characters
                  </span>
                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#08245C] dark:bg-blue-600 hover:bg-[#061B40] dark:hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    {submittingComment ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 text-center space-y-3">
            <LogIn className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
            <h4 className="text-base font-bold text-[#08245C] dark:text-white">
              Join the Conversation
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Please sign in with your student or staff account to ask questions, share reviews, and interact with the instructors.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0875D1] hover:bg-[#065ea8] text-white font-bold text-xs transition shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In to Comment &amp; Rate
              </Link>
            </div>
          </div>
        )}

        {/* COMMENTS LIST */}
        <div className="space-y-4 pt-2">
          {loadingComments ? (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <p className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              {!allowComments
                ? "No comments posted yet, and discussion is currently closed."
                : "No comments yet. Be the first to share your thoughts on this program!"}
            </p>
          ) : (
            comments.map((comment) => {
              const isAuthor = currentUser && comment.userId === currentUser.id;
              const isStaff = currentUser && (currentUser.role === "ADMIN" || currentUser.role === "EDITOR");
              const canDelete = isAuthor || isStaff;
              const reactions = comment.reactions || {};
              const userReactions = comment.userReactions || [];

              return (
                <div
                  key={comment.id}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700">
                        {comment.userAvatar ? (
                          <Image
                            src={comment.userAvatar}
                            alt={comment.userName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
                            {comment.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-[#08245C] dark:text-white">
                          {comment.userName}
                        </strong>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-2">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 transition opacity-0 group-hover:opacity-100"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line pl-11">
                    {comment.message}
                  </p>

                  {/* Comment reactions row */}
                  <div className="pl-11 flex flex-wrap items-center gap-2 pt-1">
                    {/* Active reactions badges */}
                    {Object.entries(reactions).map(([emoji, count]) => {
                      const userReacted = userReactions.includes(emoji);
                      return (
                        <button
                          key={emoji}
                          type="button"
                          disabled={!allowComments}
                          onClick={() => allowComments && handleEmojiReaction(comment.id, emoji)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
                            userReacted
                              ? "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                          } ${!allowComments ? "cursor-default opacity-80" : ""}`}
                        >
                          <span>{emoji}</span>
                          <span className="text-[11px] font-bold">{count}</span>
                        </button>
                      );
                    })}

                    {/* Add Reaction Picker Button */}
                    {allowComments && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setPickerCommentId(pickerCommentId === comment.id ? null : comment.id)
                          }
                          className="p-1 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition"
                          title="Add reaction"
                        >
                          <SmilePlus className="w-3.5 h-3.5" />
                        </button>

                      {/* Emoji Picker Popover */}
                      {pickerCommentId === comment.id && (
                        <div className="absolute left-0 bottom-full mb-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 flex items-center gap-1 z-30 animate-in fade-in zoom-in-95">
                          {AVAILABLE_REACTIONS.map(({ emoji, label }) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleEmojiReaction(comment.id, emoji)}
                              className="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-base transition hover:scale-125"
                              title={label}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
