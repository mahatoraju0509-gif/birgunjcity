"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAd } from "@/lib/articles";
import { Ad } from "@/types/article";

export default function NewAd() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [position, setPosition] = useState<Ad["position"]>("homepage_top");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createAd({ title, imageUrl, linkUrl, position, active });
      router.push("/admin/dashboard");
    } catch (err) {
      alert("समस्या भयो, फेरि प्रयास गर्नुहोस्।");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-navy text-white px-6 py-4">
        <h1 className="text-lg font-bold">नयाँ विज्ञापन थप्नुहोस्</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-4 py-6 bg-white rounded-lg shadow my-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">विज्ञापनको नाम</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Banner फोटो URL</label>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Click गर्दा जाने Link</label>
          <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} required className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">कहाँ देखाउने?</label>
          <select value={position} onChange={(e) => setPosition(e.target.value as Ad["position"])} className="w-full border rounded-lg px-3 py-2">
            <option value="homepage_top">गृहपृष्ठ — माथि</option>
            <option value="homepage_sidebar">गृहपृष्ठ — Sidebar</option>
            <option value="category_top">क्याटागोरी पेज — माथि</option>
            <option value="article_inline">समाचार भित्र</option>
            <option value="sticky_bottom">तल Sticky Banner (Mobile)</option>
            <option value="homepage_infeed">गृहपृष्ठ — News List बीचमा</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          अहिले Active गर्ने (देखाउने)
        </label>
        <button type="submit" disabled={saving} className="w-full bg-brand-gold text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50">
          {saving ? "सेभ हुँदैछ..." : "विज्ञापन थप्नुहोस्"}
        </button>
      </form>
    </div>
  );
}