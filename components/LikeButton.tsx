"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { hasUserLiked, likeArticle, unlikeArticle } from "@/lib/articles";

export default function LikeButton({ articleId, initialLikes }: { articleId: string; initialLikes: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [likes, setLikes] = useState(initialLikes);
  const [likeId, setLikeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const existing = await hasUserLiked(articleId, u.uid);
        setLikeId(existing);
      }
    });
    return () => unsub();
  }, [articleId]);

  async function handleClick() {
    if (!user) {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return;
    }
    setLoading(true);
    try {
      if (likeId) {
        await unlikeArticle(likeId, articleId, likes);
        setLikes((l) => Math.max(0, l - 1));
        setLikeId(null);
      } else {
        await likeArticle(articleId, user.uid, likes);
        setLikes((l) => l + 1);
        const newId = await hasUserLiked(articleId, user.uid);
        setLikeId(newId);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition border " +
        (likeId
          ? "bg-red-50 border-red-200 text-red-600"
          : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50")
      }
    >
      <span className={likeId ? "animate-heart-pop inline-block" : "inline-block"}>{likeId ? "❤️" : "🤍"}</span>
      <span>{likes}</span>
    </button>
  );
}