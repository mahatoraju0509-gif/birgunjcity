import Link from "next/link";
import { getPublishedArticles } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GalleryPage() {
  const allArticles = await getPublishedArticles(100);
  const withPhotos = allArticles.filter((a) => a.imageUrl);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-brand-navy mb-2">फोटो ग्यालरी</h1>
      <p className="text-gray-500 mb-8">{withPhotos.length} फोटो</p>

      {withPhotos.length === 0 ? (
        <p className="text-center text-gray-400 py-16">अहिलेसम्म कुनै फोटो छैन।</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {withPhotos.map((a) => {
            const cat = CATEGORIES.find((c) => c.id === a.category);
            return (
              <Link
                key={a.id}
                href={"/post/" + a.id}
                className="group relative block aspect-square overflow-hidden rounded-lg bg-gray-100"
              >
                <img
                  src={a.imageUrl}
                  alt={a.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <span className="text-xs font-semibold text-brand-gold mb-1">{cat?.name}</span>
                  <p className="text-white text-sm font-medium line-clamp-2">{a.title}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}