"use client";

import { useState, useEffect } from "react";
import { getActiveAds, incrementAdClick } from "@/lib/articles";
import { Ad } from "@/types/article";

export default function StickyBottomAd() {
  const [ad, setAd] = useState<Ad | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    getActiveAds("sticky_bottom").then((ads) => {
      if (ads.length > 0) setAd(ads[0]);
    });
  }, []);

  if (!ad || closed) return null;

  function handleClick() {
    incrementAdClick(ad!.id).catch(() => {});
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg md:hidden">
      <button
        onClick={() => setClosed(true)}
        className="absolute -top-3 right-2 w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-xs"
        aria-label="Close"
      >
        ✕
      </button>
      <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" onClick={handleClick} className="block">
        <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto max-h-20 object-cover" />
      </a>
    </div>
  );
}