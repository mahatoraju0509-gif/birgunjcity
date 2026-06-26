import { getPublishedArticles } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";

export const dynamic = "force-dynamic";

export async function GET() {
  const articles = await getPublishedArticles(500);
  const baseUrl = "https://birgunjcity.com";

  const staticUrls = [
    { loc: baseUrl, priority: "1.0" },
    { loc: baseUrl + "/search", priority: "0.5" },
    ...CATEGORIES.map((cat) => ({
      loc: baseUrl + "/category/" + cat.id,
      priority: "0.8",
    })),
  ];

  const articleUrls = articles.map((a) => ({
    loc: baseUrl + "/post/" + a.id,
    lastmod: new Date(a.updatedAt).toISOString(),
    priority: "0.6",
  }));

  const urlEntries = [
    ...staticUrls.map(
      (u) => `
  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
  </url>`
    ),
    ...articleUrls.map(
      (u) => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
    ),
  ].join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}