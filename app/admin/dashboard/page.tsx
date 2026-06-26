"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAllArticlesAdmin, deleteArticle, getAllAdsAdmin, deleteAd, getAdminRole } from "@/lib/articles";
import { Article, Ad } from "@/types/article";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"articles" | "ads" | "analytics">("articles");
  const [articles, setArticles] = useState<Article[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [role, setRole] = useState<"editor" | "reporter" | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.email) {
        router.push("/admin/login");
        return;
      }
      const userRole = await getAdminRole(user.email);
      if (!userRole) {
        alert("तपाईंलाई Admin Panel प्रयोग गर्ने अनुमति छैन।");
        await signOut(auth);
        router.push("/admin/login");
        return;
      }
      setRole(userRole);
      setUserEmail(user.email);
      setCheckingAuth(false);
      loadData();
    });
    return () => unsub();
  }, [router]);

  async function loadData() {
    setLoading(true);
    try {
      const [a, ad] = await Promise.all([getAllArticlesAdmin(), getAllAdsAdmin()]);
      setArticles(a);
      setAds(ad);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteArticle(id: string) {
    if (!confirm("के तपाईं यो समाचार मेटाउन चाहनुहुन्छ?")) return;
    await deleteArticle(id);
    loadData();
  }

  function toggleSelect(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleBulkDelete() {
    if (selected.length === 0) return;
    if (!confirm(selected.length + " समाचार मेटाउन चाहनुहुन्छ?")) return;
    await Promise.all(selected.map((id) => deleteArticle(id)));
    setSelected([]);
    loadData();
  }

  async function handleDeleteAd(id: string) {
    if (!confirm("के तपाईं यो विज्ञापन मेटाउन चाहनुहुन्छ?")) return;
    await deleteAd(id);
    loadData();
  }

  async function handleLogout() {
    await signOut(auth);
    router.push("/admin/login");
  }

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const isEditor = role === "editor";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-navy text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold">BirgunjCity — Admin Dashboard</h1>
          <p className="text-xs text-white/60">{userEmail} · {isEditor ? "Editor" : "Reporter"}</p>
        </div>
        <button onClick={handleLogout} className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("articles")} className={"px-4 py-2 rounded-lg text-sm font-semibold " + (tab === "articles" ? "bg-brand-navy text-white" : "bg-gray-200 text-gray-600")}>
            समाचार ({articles.length})
          </button>
          {isEditor && (
            <button onClick={() => setTab("ads")} className={"px-4 py-2 rounded-lg text-sm font-semibold " + (tab === "ads" ? "bg-brand-navy text-white" : "bg-gray-200 text-gray-600")}>
              विज्ञापन ({ads.length})
            </button>
          )}
          <button onClick={() => setTab("analytics")} className={"px-4 py-2 rounded-lg text-sm font-semibold " + (tab === "analytics" ? "bg-brand-navy text-white" : "bg-gray-200 text-gray-600")}>
            Analytics
          </button>
        </div>

        {tab === "articles" && (
          <>
            <div className="flex justify-between items-center mb-4">
              {selected.length > 0 ? (
                <button onClick={handleBulkDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700">
                  {selected.length} वटा मेटाउनुहोस्
                </button>
              ) : <span />}
              <Link href="/admin/dashboard/new" className="bg-brand-gold text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90">
                + नयाँ समाचार
              </Link>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : articles.length === 0 ? (
              <p className="text-gray-500">अहिलेसम्म कुनै समाचार थपिएको छैन।</p>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {articles.map((a) => (
                  <div key={a.id} className="flex justify-between items-center px-4 py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggleSelect(a.id)} />
                      <div>
                      <p className="font-medium text-brand-navy">{a.title}</p>
                      <p className="text-xs text-gray-500">
                        {a.category} ·{" "}
                        {a.scheduledAt && a.scheduledAt > Date.now()
                          ? "⏰ Scheduled: " + new Date(a.scheduledAt).toLocaleString("ne-NP")
                          : a.status === "published" ? "✅ Published" : a.status === "review" ? "🟡 Review मा" : "📝 Draft"}
                        {a.isBreaking ? " · 🔴 Breaking" : ""}
                        {a.isFeatured ? " · ⭐ Featured" : ""}
                      </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link href={"/post/" + a.id} target="_blank" className="text-sm text-green-600 hover:underline">View</Link>
                      <Link href={"/admin/dashboard/edit/" + a.id} className="text-sm text-blue-600 hover:underline">Edit</Link>
                      {isEditor && (
                        <button onClick={() => handleDeleteArticle(a.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "analytics" && (
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-bold text-brand-navy mb-4">सबैभन्दा बढी पढिएका समाचार</h3>
            <div className="space-y-3">
              {[...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10).map((a, i) => {
                const maxViews = Math.max(...articles.map((x) => x.views || 0), 1);
                const pct = ((a.views || 0) / maxViews) * 100;
                return (
                  <div key={a.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-brand-navy line-clamp-1">{i + 1}. {a.title}</span>
                      <span className="text-gray-500 shrink-0 ml-2">
                        👁️ {a.views || 0} · ❤️ {a.likes || 0} · 🔗 {a.shares || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-brand-gold h-2 rounded-full" style={{ width: pct + "%" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "ads" && isEditor && (
          <>
            <div className="flex justify-end mb-4">
              <Link href="/admin/dashboard/ads/new" className="bg-brand-gold text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90">
                + नयाँ विज्ञापन
              </Link>
            </div>
            {ads.length === 0 ? (
              <p className="text-gray-500">अहिलेसम्म कुनै विज्ञापन थपिएको छैन।</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ads.map((ad) => (
                  <div key={ad.id} className="bg-white rounded-lg shadow p-3">
                    <img src={ad.imageUrl} alt={ad.title} className="w-full h-32 object-cover rounded mb-2" />
                    <p className="font-medium text-sm text-brand-navy">{ad.title}</p>
                    <p className="text-xs text-gray-500">{ad.position} · {ad.active ? "✅ Active" : "⏸️ Inactive"} · 🖱️ {ad.clicks || 0} clicks</p>
                    <button onClick={() => handleDeleteAd(ad.id)} className="text-sm text-red-600 hover:underline mt-2">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}