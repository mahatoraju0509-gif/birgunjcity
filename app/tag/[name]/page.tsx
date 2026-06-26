import Link from "next/link";
import { getArticlesByTag } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TagPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const tag = decodeURIComponent(name);
  const articles = await getArticlesByTag(tag);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-brand-navy mb-2">#{tag}</h1>
      <p className="text-gray-500 mb-6">{articles.length} समाचार भेटियो</p>

      {articles.length === 0 ? (
        <p className="text-center text-gray-400 py-16">यो tag मा कुनै समाचार छैन।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => {
            const cat = CATEGORIES.find((c) => c.id === a.category);
            return (
              <Link key={a.id} href={"/post/" + a.id} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="h-44 bg-gray-100 overflow-hidden">
                  {a.imageUrl ? (
                    <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">फोटो छैन</div>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold" style={{ color: cat?.color }}>{cat?.name}</span>
                  <p className="font-bold text-brand-navy line-clamp-2 group-hover:text-brand-gold transition">{a.title}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}