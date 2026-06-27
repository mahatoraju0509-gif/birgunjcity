"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle } from "@/lib/articles";
import { CATEGORIES, ArticleCategory } from "@/types/article";
import RichTextEditor from "@/components/RichTextEditor";

export default function NewArticle() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ArticleCategory>("desh");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "review" | "published">("review");
  const [scheduledAt, setScheduledAt] = useState("");
  const [saving, setSaving] = useState(false);

  function makeSlug(text: string) {
    return (
      text.toLowerCase().trim().replace(/[^a-z0-9\u0900-\u097F]+/g, "-").replace(/^-+|-+$/g, "") +
      "-" + Date.now()
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
      await createArticle({
        title, slug: makeSlug(title), excerpt, content, category, imageUrl, videoUrl,
        author: author || "BirgunjCity Desk",
        tags,
        isBreaking, isFeatured, views: 0, likes: 0, shares: 0, status,
        scheduledAt: scheduledAt ? new Date(scheduledAt).getTime() : null,
      });
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
        <h1 className="text-lg font-bold">नयाँ समाचार थप्नुहोस्</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 bg-white rounded-lg shadow my-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">शीर्षक (Title)</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">छोटो सारांश (Excerpt)</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} required className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">पूरा समाचार (Content)</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">फोटो URL</label>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://i.ibb.co/xxxx/photo.jpg" className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">YouTube Video URL (वैकल्पिक)</label>
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=xxxxx" className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (अल्पविरामले छुट्टाउनुहोस्)</label>
          <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="राजनीति, बीरगंज, चुनाव" className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">क्याटागोरी</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as ArticleCategory)} className="w-full border rounded-lg px-3 py-2">
              {CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">लेखक</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="BirgunjCity Desk" className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isBreaking} onChange={(e) => setIsBreaking(e.target.checked)} />
            ब्रेकिंग न्यूज
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            फिचर्ड (प्रमुख समाचार)
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "review" | "published")} className="w-full border rounded-lg px-3 py-2">
            <option value="draft">Draft (अहिले नहोस्)</option>
            <option value="review">Review मा पठाउनुहोस् (Editor लाई)</option>
            <option value="published">Published (सार्वजनिक) — Editor मात्र</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Schedule (वैकल्पिक — भविष्यमा यो समयमा Publish होस्)</label>
          <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          <p className="text-xs text-gray-500 mt-1">खाली छाड्नुहोस् भने अहिले नै Publish हुनेछ (Status published भए)।</p>
        </div>
        <button type="submit" disabled={saving} className="w-full bg-brand-gold text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50">
          {saving ? "सेभ हुँदैछ..." : "समाचार प्रकाशित गर्नुहोस्"}
        </button>
      </form>
    </div>
  );
}