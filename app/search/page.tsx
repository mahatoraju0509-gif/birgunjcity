import Link from "next/link";
import { getPublishedArticles } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q || "").trim().toLowerCase();

  const allArticles = query ? await getPublishedArticles(200) : [];
  const results = query
    ? allArticles.filter((a) =>
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <form action="/search" method="GET" className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="समाचार खोज्नुहोस्..."
            className="flex-1 border rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-navy"
            autoFocus
          />
          <button type="submit" className="bg-brand-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-navy-light transition">
            खोज्नुहोस्
          </button>
        </div>
      </form>

      {query && (
        <p className="text-gray-500 mb-6">
          &quot;{q}&quot; को लागि {results.length} परिणाम भेटियो
        </p>
      )}

      {query && results.length === 0 && (
        <p className="text-center text-gray-400 py-16">कुनै समाचार भेटिएन।</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {results.map((a) => {
          const cat = CATEGORIES.find((c) => c.id === a.category);
          return (
            <Link
              key={a.id}
              href={"/post/" + a.id}
              className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex gap-3 p-3"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                {a.imageUrl ? (
                  <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">फोटो छैन</div>
                )}
              </div>
              <div>
                <span className="text-xs font-semibold" style={{ color: cat?.color }}>{cat?.name}</span>
                <p className="text-sm font-medium text-brand-navy line-clamp-2 group-hover:text-brand-gold transition">
                  {a.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}