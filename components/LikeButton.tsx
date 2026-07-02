"use client";

import { useState, useTransition } from "react";

export default function LikeButton({
  slug,
  initialLikes,
  initialLiked,
}: {
  slug: string;
  initialLikes: number;
  initialLiked: boolean;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    // Optimistic update, reconciled with the server response (which is the
    // source of truth since the DB enforces one like per voter per post).
    const prevLikes = likes;
    const prevLiked = liked;
    setLiked(!prevLiked);
    setLikes(prevLiked ? prevLikes - 1 : prevLikes + 1);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/posts/${slug}/like`, { method: "POST" });
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        setLikes(data.likes);
        setLiked(data.liked);
      } catch {
        setLikes(prevLikes);
        setLiked(prevLiked);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={liked}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
        liked
          ? "bg-accent text-white border-accent"
          : "bg-transparent text-ink border-black/20 hover:border-accent hover:text-accent"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
        />
      </svg>
      {liked ? "Liked" : "Like"} &middot; {likes.toLocaleString()}
    </button>
  );
}
