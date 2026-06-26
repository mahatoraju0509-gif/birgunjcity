"use client";

import { incrementAdClick } from "@/lib/articles";

export default function AdBanner({ ad }: { ad: { id: string; imageUrl: string; linkUrl: string; title: string } }) {
  function handleClick() {
    incrementAdClick(ad.id).catch(() => {});
  }

  return (
    <div className="my-6">
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">विज्ञापन</p>
      <a
        href={ad.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="group block w-full overflow-hidden rounded-lg border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
      >
        <div className="overflow-hidden">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </a>
    </div>
  );
}