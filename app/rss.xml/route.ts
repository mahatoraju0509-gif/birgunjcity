import { getPublishedArticles } from "@/lib/articles";
import { CATEGORIES } from "@/types/article";

export const dynamic = "force-dynamic";

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = await getPublishedArticles(50);

  const items = articles
    .map((a) => {
      const cat = CATEGORIES.find((c) => c.id === a.category);
      const link = "https://birgunjcity.com/post/" + a.id;
      const pubDate = new Date(a.createdAt).toUTCString();
      const enclosure = a.imageUrl
        ? '<enclosure url="' + escapeXml(a.imageUrl) + '" type="image/jpeg" />'
        : "";
      return [
        "",
        "    <item>",
        "      <title>" + escapeXml(a.title) + "</title>",
        "      <link>" + link + "</link>",
        '      <guid isPermaLink="true">' + link + "</guid>",
        "      <description>" + escapeXml(a.excerpt) + "</description>",
        "      <category>" + escapeXml(cat?.name || "") + "</category>",
        "      <author>" + escapeXml(a.author) + "</author>",
        "      <pubDate>" + pubDate + "</pubDate>",
        "      " + enclosure,
        "    </item>",
      ].join("\n");
    })
    .join("");

  const rss =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    "  <channel>\n" +
    "    <title>BirgunjCity.com — बीरगंज र मध्धेश प्रदेशको ताजा समाचार</title>\n" +
    "    <link>https://birgunjcity.com</link>\n" +
    "    <description>बीरगंज र मध्धेश प्रदेशको भरपर्दो समाचार पोर्टल।</description>\n" +
    "    <language>ne-np</language>\n" +
    '    <atom:link href="https://birgunjcity.com/rss.xml" rel="self" type="application/rss+xml" />' +
    items +
    "\n  </channel>\n" +
    "</rss>";

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}