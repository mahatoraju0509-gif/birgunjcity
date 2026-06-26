import { notFound } from "next/navigation";
import { getArticleById, getArticlesByCategory, getActiveAds, getCommentCount } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";
import Link from "next/link";
import ViewTracker from "@/components/ViewTracker";
import AnimatedCounter from "@/components/AnimatedCounter";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import BookmarkButton from "@/components/BookmarkButton";
import ShareButtons from "@/components/ShareButtons";
import FontSizeControl from "@/components/FontSizeControl";
import PrintButton from "@/components/PrintButton";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) return {};
  return {
    title: article.title + " — BirgunjCity.com",
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.imageUrl ? [article.imageUrl] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) return notFound();

  const cat = CATEGORIES.find((c) => c.id === article.category);
  const [related, inlineAds, commentCount] = await Promise.all([
    getArticlesByCategory(article.category, 4),
    getActiveAds("article_inline"),
    getCommentCount(id),
  ]);
  const relatedFiltered = related.filter((a) => a.id !== article.id).slice(0, 3);

  const shareUrl = "https://birgunjcity.com/post/" + article.id;

  return (
    <>
      <ViewTracker id={article.id} currentViews={article.views || 0} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href={"/category/" + article.category} className="text-sm font-semibold" style={{ color: cat?.color }}>
          ← {cat?.name}
        </Link>

        <h1 className="text-3xl font-extrabold text-brand-navy mt-4 mb-2 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
          <Link href={"/author/" + encodeURIComponent(article.author)} className="hover:text-brand-navy hover:underline">
            {article.author}
          </Link>
          <span>•</span>
          <span>{new Date(article.createdAt).toLocaleDateString("ne-NP", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>•</span>
          <span><AnimatedCounter value={(article.views || 0) + 1} /> पटक पढिएको</span>
        <span>•</span>
        <span>{Math.max(1, Math.ceil(article.content.replace(/<[^>]*>/g, "").split(" ").length / 200))} मिनेट पढाइ</span>
        <span>•</span>
        <span>💬 {commentCount} प्रतिक्रिया</span>
        </div>

        <div className="flex gap-3 mb-6 text-sm items-center">
          <LikeButton articleId={article.id} initialLikes={article.likes || 0} />
          <BookmarkButton articleId={article.id} />
          <ShareButtons articleId={article.id} currentShares={article.shares || 0} title={article.title} shareUrl={shareUrl} />
          <PrintButton />
        </div>

        {article.videoUrl ? (
          <div className="rounded-xl overflow-hidden mb-6 bg-black aspect-video">
            <iframe
              src={article.videoUrl.replace("watch?v=", "embed/")}
              className="w-full h-full"
              allowFullScreen
              title={article.title}
            />
          </div>
        ) : article.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-6 bg-gray-100">
            <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover" />
          </div>
        )}

        <FontSizeControl>
          <p className="text-lg text-gray-700 font-medium mb-4 leading-relaxed">{article.excerpt}</p>
          <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
        </FontSizeControl>

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
                <Link key={a.id} href={"/post/" + a.id} className="group block">
                  <div className="h-28 bg-gray-100 rounded-lg overflow-hidden mb-2">
                    {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition" />}
                  </div>
                  <p className="text-sm font-medium text-brand-navy line-clamp-2 group-hover:text-brand-gold">{a.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <CommentSection articleId={article.id} />
      </div>
    </>
  );
}