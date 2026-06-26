"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getCommentsByArticle, addComment, deleteComment } from "@/lib/articles";
import { Comment } from "@/types/article";

export default function CommentSection({ articleId }: { articleId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    loadComments();
    return () => unsub();
  }, [articleId]);

  async function loadComments() {
    setLoading(true);
    try {
      const data = await getCommentsByArticle(articleId);
      setComments(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function handleLogout() {
    await signOut(auth);
  }

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setPosting(true);
    try {
      await addComment({
        articleId,
        userName: user.displayName || "User",
        userPhoto: user.photoURL || "",
        text: text.trim(),
      });
      setText("");
      loadComments();
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("के तपाईं यो प्रतिक्रिया मेटाउन चाहनुहुन्छ?")) return;
    await deleteComment(id);
    loadComments();
  }

  return (
    <div className="mt-10 pt-6 border-t">
      <h3 className="font-bold text-brand-navy text-lg mb-4">प्रतिक्रिया ({comments.length})</h3>

      {user ? (
        <form onSubmit={handlePost} className="mb-6">
          <div className="flex items-start gap-3">
            {user.photoURL && (
              <img src={user.photoURL} alt={user.displayName || ""} className="w-9 h-9 rounded-full shrink-0" />
            )}
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="तपाईंको प्रतिक्रिया लेख्नुहोस्..."
                rows={2}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
              <div className="flex justify-between items-center mt-2">
                <button type="button" onClick={handleLogout} className="text-xs text-gray-400 hover:underline">
                  Logout ({user.displayName})
                </button>
                <button
                  type="submit"
                  disabled={posting || !text.trim()}
                  className="bg-brand-navy text-white text-sm px-4 py-1.5 rounded-lg hover:bg-brand-navy-light transition disabled:opacity-50"
                >
                  {posting ? "पोस्ट हुँदैछ..." : "पोस्ट गर्नुहोस्"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={handleLogin}
          className="mb-6 flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          🔵 Google मार्फत Login गरी प्रतिक्रिया दिनुहोस्
        </button>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-400">अहिलेसम्म कुनै प्रतिक्रिया छैन। पहिलो प्रतिक्रिया दिनुहोस्!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              {c.userPhoto ? (
                <img src={c.userPhoto} alt={c.userName} className="w-9 h-9 rounded-full shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
                  {c.userName.charAt(0)}
                </div>
              )}
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-brand-navy">{c.userName}</p>
                  {user && user.displayName === c.userName && (
                    <button onClick={() => handleDelete(c.id)} className="text-xs text-red-500 hover:underline">
                      मेटाउनुहोस्
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1">{c.text}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(c.createdAt).toLocaleDateString("ne-NP", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}