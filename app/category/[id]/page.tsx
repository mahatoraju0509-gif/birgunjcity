import { notFound } from "next/navigation";
import { CATEGORIES, ArticleCategory } from "@/types/article";
import { getArticlesByCategory, getActiveAds } from "@/lib/articles";
import ArticleGrid from "@/components/ArticleGrid";

export const revalidate = 30;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cat = CATEGORIES.find((c) => c.id === id);
  if (!cat) return {};
  return {
    title: cat.name + " समाचार — BirgunjCity.com",
    description: "बीरगंज र मध्धेश प्रदेशका " + cat.name + " सम्बन्धी ताजा समाचार, अपडेट र विश्लेषण।",
    openGraph: {
      title: cat.name + " समाचार — BirgunjCity.com",
      description: "बीरगंज र मध्धेश प्रदेशका " + cat.name + " सम्बन्धी ताजा समाचार।",
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cat = CATEGORIES.find((c) => c.id === id);
  if (!cat) return notFound();

  const [articles, topAds] = await Promise.all([
    getArticlesByCategory(id as ArticleCategory, 60),
    getActiveAds("category_top"),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: cat.color }} />
        <h1 className="text-3xl font-extrabold" style={{ color: cat.color }}>
          {cat.name}
        </h1>
        <span className="text-sm text-gray-400 ml-2">{articles.length} समाचार</span>
      </div>

      {topAds.length > 0 && (
        <a href={topAds[0].linkUrl} target="_blank" rel="noopener noreferrer" className="block mb-6 rounded-lg overflow-hidden shadow-sm">
          <img src={topAds[0].imageUrl} alt={topAds[0].title} className="w-full h-auto object-cover" />
        </a>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-lg">यो क्याटागोरीमा अहिलेसम्म कुनै समाचार छैन।</p>
        </div>
      ) : (
        <ArticleGrid initialArticles={articles} category={cat} />
      )}
    </div>
  );
}