import Link from "next/link";
import { getPublishedArticles } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AuthorPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const authorName = decodeURIComponent(name);
  const allArticles = await getPublishedArticles(200);
  const articles = allArticles.filter((a) => a.author === authorName);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white border rounded-xl p-6 flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-brand-navy text-white flex items-center justify-center text-3xl font-bold shrink-0">
          {authorName.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy">{authorName}</h1>
          <p className="text-sm text-gray-500">BirgunjCity.com का संवाददाता · {articles.length} समाचार</p>
        </div>
      </div>

      {articles.length === 0 ? (
        <p className="text-center text-gray-400 py-16">कुनै समाचार भेटिएन।</p>
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