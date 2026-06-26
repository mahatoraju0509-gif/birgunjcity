import Link from "next/link";
import { getPublishedArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function VideosPage() {
  const allArticles = await getPublishedArticles(100);
  const withVideo = allArticles.filter((a) => a.videoUrl);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-brand-navy mb-2">भिडियो</h1>
      <p className="text-gray-500 mb-8">{withVideo.length} भिडियो</p>

      {withVideo.length === 0 ? (
        <p className="text-center text-gray-400 py-16">अहिलेसम्म कुनै भिडियो छैन।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {withVideo.map((a) => (
            <Link key={a.id} href={"/post/" + a.id} className="group block">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-2xl">▶️</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 font-medium text-brand-navy line-clamp-2 group-hover:text-brand-gold transition">{a.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}