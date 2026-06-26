"use client";

import { useState } from "react";
import Link from "next/link";
import { Article, Category } from "@/types/article";

export default function ArticleGrid({
  initialArticles,
  category,
}: {
  initialArticles: Article[];
  category: Category;
}) {
  const [visibleCount, setVisibleCount] = useState(9);
  const visible = initialArticles.slice(0, visibleCount);
  const hasMore = visibleCount < initialArticles.length;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((a) => (
          <Link
            key={a.id}
            href={"/post/" + a.id}
            className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
          >
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              {a.imageUrl ? (
                <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">फोटो छैन</div>
              )}
              {a.isBreaking && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                  ब्रेकिंग
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="font-bold text-brand-navy leading-snug line-clamp-2 group-hover:text-brand-gold transition-colors duration-200">
                {a.title}
              </p>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{a.excerpt}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">{a.author}</span>
                <span
                  className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: category.color }}
                >
                  पढ्नुहोस् →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisibleCount((c) => c + 9)}
            className="bg-brand-navy text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-navy-light transition"
          >
            थप समाचार हेर्नुहोस्
          </button>
        </div>
      )}
    </>
  );
}