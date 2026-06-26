import { notFound } from "next/navigation";
import { getArticleBySlug, getArticlesByCategory, getActiveAds } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return notFound();

  const cat = CATEGORIES.find((c) => c.id === article.category);
  const [related, inlineAds] = await Promise.all([
    getArticlesByCategory(article.category, 4),
    getActiveAds("article_inline"),
  ]);
  const relatedFiltered = related.filter((a) => a.id !== article.id).slice(0, 3);

  const shareUrl = "https://birgunjcity.com/noticia/" + article.slug;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href={"/category/" + article.category} className="text-sm font-semibold" style={{ color: cat?.color }}>
        ← {cat?.name}
      </Link>

      <h1 className="text-3xl font-extrabold text-brand-navy mt-4 mb-2 leading-tight">
        {article.title}
      </h1>

      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
        <span>{article.author}</span>
        <span>•</span>
        <span>{new Date(article.createdAt).toLocaleDateString("ne-NP", { year: "numeric", month: "long", day: "numeric" })}</span>
        <span>•</span>
        <span>{article.views || 0} पटक पढिएको</span>
      </div>

      <div className="flex gap-3 mb-6 text-sm">
        <a
          href={"https://wa.me/?text=" + encodeURIComponent(article.title + " " + shareUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-3 py-1.5 rounded-full hover:bg-green-600 transition"
        >
          WhatsApp मा शेयर
        </a>
        <a
          href={"https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition"
        >
          Facebook मा शेयर
        </a>
      </div>

      {article.imageUrl && (
        <div className="rounded-xl overflow-hidden mb-6 bg-gray-100">
          <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover" />
        </div>
      )}

      <p className="text-lg text-gray-700 font-medium mb-4 leading-relaxed">{article.excerpt}</p>

      <div className="text-gray-800 leading-relaxed whitespace-pre-line">{article.content}</div>

      {inlineAds.length > 0 && (
        <a href={inlineAds[0].linkUrl} target="_blank" rel="noopener noreferrer" className="block my-8 rounded-lg overflow-hidden shadow-sm">
          <img src={inlineAds[0].imageUrl} alt={inlineAds[0].title} className="w-full h-auto object-cover" />
        </a>
      )}

      {relatedFiltered.length > 0 && (
        <div className="mt-10 pt-6 border-t">
          <h3 className="font-bold text-brand-navy mb-4">सम्बन्धित समाचार</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedFiltered.map((a) => (
              <Link key={a.id} href={"/noticia/" + a.slug} className="group block">
                <div className="h-28 bg-gray-100 rounded-lg overflow-hidden mb-2">
                  {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition" />}
                </div>
                <p className="text-sm font-medium text-brand-navy line-clamp-2 group-hover:text-brand-gold">{a.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}