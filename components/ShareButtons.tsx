"use client";

import { incrementShares } from "@/lib/articles";

export default function ShareButtons({
  articleId,
  currentShares,
  title,
  shareUrl,
}: {
  articleId: string;
  currentShares: number;
  title: string;
  shareUrl: string;
}) {
  function track() {
    incrementShares(articleId, currentShares).catch(() => {});
  }

  return (
    <>
      <a
        href={"https://wa.me/?text=" + encodeURIComponent("📰 " + title + "\n\n👉 पूरा समाचार पढ्नुहोस्:\n" + shareUrl + "\n\n#BirgunjCity")}
        target="_blank"
        rel="noopener noreferrer"
        onClick={track}
        className="bg-green-500 text-white px-3 py-1.5 rounded-full hover:bg-green-600 transition"
      >
        WhatsApp मा शेयर
      </a>
      <a
        href={"https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareUrl)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={track}
        className="bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition"
      >
        Facebook मा शेयर
      </a>
      {currentShares > 0 && (
        <span className="text-xs text-gray-400 self-center">{currentShares} पटक शेयर भएको</span>
      )}
    </>
  );
}