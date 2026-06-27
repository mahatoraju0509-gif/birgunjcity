import Link from "next/link";
import { getMostSharedArticles } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";
import NewsletterBox from "@/components/NewsletterBox";
import AdBanner from "@/components/AdBanner";
import {
  getBreakingNews,
  getFeaturedArticles,
  getActiveAds,
  getAllPublishedGroupedByCategory,
} from "@/lib/articles";

export const revalidate = 30;

export default async function Home() {
  const [breaking, featured, topAds, sidebarAds, grouped, mostShared] = await Promise.all([
    getBreakingNews(),
    getFeaturedArticles(),
    getActiveAds("homepage_top"),
    getActiveAds("homepage_sidebar"),
    getAllPublishedGroupedByCategory(4),
    getMostSharedArticles(5),
  ]);

  const trending = featured.length > 0 ? featured : breaking;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      {breaking.length > 0 && (
        <div className="bg-red-600 text-white rounded-lg px-4 py-2.5 mb-6 flex items-center gap-3 overflow-hidden">
          <span className="bg-white text-red-600 font-bold text-xs px-2 py-1 rounded shrink-0 animate-pulse-breaking">
            ब्रेकिंग
          </span>
          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="animate-marquee">
              <span className="text-sm font-medium px-4">
                {breaking.map((a) => a.title).join("   •   ")}
              </span>
              <span className="text-sm font-medium px-4">
                {breaking.map((a) => a.title).join("   •   ")}
              </span>
            </div>
          </div>
        </div>
      )}

      {topAds.length > 0 && <AdBanner ad={topAds[0]} />}

      {trending.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto bg-white border rounded-lg px-4 py-2 text-sm">
          <span className="font-bold text-brand-navy shrink-0">ट्रेन्डिङ:</span>
          {trending.slice(0, 5).map((a, i) => (
            <Link key={a.id} href={"/post/" + a.id} className="text-gray-600 hover:text-brand-gold whitespace-nowrap shrink-0">
              #{a.title.split(" ").slice(0, 3).join("")}
              {i < trending.length - 1 && <span className="mx-2 text-gray-300">|</span>}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {featured.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-brand-navy inline-block pb-1 mb-4 animate-title-in animate-underline">
                प्रमुख समाचार
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href={"/post/" + featured[0].id} className="md:col-span-2 group block">
                  <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden">
                    {featured[0].imageUrl ? (
                      <img loading="lazy" src={featured[0].imageUrl} alt={featured[0].title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">फोटो छैन</div>
                    )}
                  </div>
                  <p className="mt-3 font-bold text-brand-navy text-xl leading-snug group-hover:text-brand-gold transition">
                    {featured[0].title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{featured[0].excerpt}</p>
                </Link>
                <div className="flex flex-col gap-4">
                  {featured.slice(1, 3).map((a) => (
                    <Link key={a.id} href={"/post/" + a.id} className="group block bg-gray-100 rounded-lg h-36 overflow-hidden relative">
                      {a.imageUrl ? (
                        <img loading="lazy" src={a.imageUrl} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm px-2 text-center">{a.title}</div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-semibold line-clamp-2">{a.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {mostShared.length > 0 && mostShared[0].shares > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-red-600 border-b-2 border-red-600 inline-block pb-1 mb-4">
                🔥 भाइरल समाचार
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mostShared.map((a) => (
                  <Link
                    key={a.id}
                    href={"/post/" + a.id}
                    className="group bg-white rounded-lg overflow-hidden border border-red-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="h-32 bg-gray-200 overflow-hidden relative">
                      {a.imageUrl ? (
                        <img loading="lazy" src={a.imageUrl} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-xs">फोटो छैन</div>
                      )}
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        🔗 {a.shares || 0}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-brand-navy line-clamp-2 group-hover:text-red-600 transition">
                        {a.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {topAds.length > 1 && <AdBanner ad={topAds[1]} />}

          {CATEGORIES.map((cat) => {
            const articles = grouped[cat.id] || [];
            if (articles.length === 0) return null;
            return (
              <section key={cat.id} className="mb-10">
                <div className="flex justify-between items-center border-b-2 pb-1 mb-4" style={{ borderColor: cat.color }}>
                  <h2 className="text-xl font-bold" style={{ color: cat.color }}>
                    {cat.name}
                  </h2>
                  <Link href={"/category/" + cat.id} className="text-sm text-brand-navy hover:underline">
                    सबै हेर्नुहोस् →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {articles.map((a) => (
                    <Link
                      key={a.id}
                      href={"/post/" + a.id}
                      className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="h-32 bg-gray-200 overflow-hidden">
                        {a.imageUrl ? (
                          <img loading="lazy" src={a.imageUrl} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-400 text-xs">फोटो छैन</div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-brand-navy line-clamp-2 group-hover:text-brand-gold transition">
                          {a.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{a.author}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          <NewsletterBox />

          {breaking.length === 0 && featured.length === 0 && Object.keys(grouped).length === 0 && (
            <p className="text-center text-gray-400 py-20">अहिलेसम्म कुनै समाचार थपिएको छैन।</p>
          )}
        </div>

        <aside className="lg:col-span-1">
          {sidebarAds.map((ad) => (
            <AdBanner key={ad.id} ad={ad} />
          ))}

          <div className="bg-white border rounded-lg p-4 sticky top-24">
            <h3 className="font-bold text-brand-navy border-b-2 border-brand-gold inline-block pb-1 mb-4">
              लोकप्रिय समाचार
            </h3>
            <div className="space-y-3">
              {trending.slice(0, 6).map((a, i) => (
                <Link key={a.id} href={"/post/" + a.id} className="flex gap-3 group">
                  <span className="text-2xl font-extrabold text-gray-200 group-hover:text-brand-gold transition">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 group-hover:text-brand-navy font-medium line-clamp-2">
                    {a.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}