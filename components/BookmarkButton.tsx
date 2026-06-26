"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { hasUserBookmarked, addBookmark, removeBookmark } from "@/lib/articles";

export default function BookmarkButton({ articleId }: { articleId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const existing = await hasUserBookmarked(articleId, u.uid);
        setBookmarkId(existing);
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
      if (bookmarkId) {
        await removeBookmark(bookmarkId);
        setBookmarkId(null);
      } else {
        await addBookmark(articleId, user.uid);
        const newId = await hasUserBookmarked(articleId, user.uid);
        setBookmarkId(newId);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={bookmarkId ? "Save हटाउनुहोस्" : "Save गर्नुहोस्"}
      className={
        "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition border " +
        (bookmarkId
          ? "bg-yellow-50 border-yellow-300 text-yellow-700"
          : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50")
      }
    >
      <span>{bookmarkId ? "🔖" : "📑"}</span>
      <span>{bookmarkId ? "Saved" : "Save"}</span>
    </button>
  );
}