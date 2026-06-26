"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserBookmarkedArticles } from "@/lib/articles";
import { Article, CATEGORIES } from "@/types/article";

export default function SavedPage() {
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const data = await getUserBookmarkedArticles(u.uid);
        setArticles(data);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function handleLogin() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-gray-400">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Saved समाचार हेर्न Login गर्नुहोस्</p>
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          🔵 Google मार्फत Login गर्नुहोस्
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-brand-navy mb-2">मेरा Saved समाचार</h1>
      <p className="text-gray-500 mb-8">{articles.length} समाचार</p>

      {articles.length === 0 ? (
        <p className="text-center text-gray-400 py-16">तपाईंले अहिलेसम्म कुनै समाचार Save गर्नुभएको छैन।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => {
            const cat = CATEGORIES.find((c) => c.id === a.category);
            return (
              <Link key={a.id} href={"/post/" + a.id} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="h-44 bg-gray-100 overflow-hidden">
                  {a.imageUrl ? (
                    <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">फोटो छैन</div>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold" style={{ color: cat?.color }}>{cat?.name}</span>
                  <p className="font-bold text-brand-navy line-clamp-2 group-hover:text-brand-gold transition">{a.title}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}