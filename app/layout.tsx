import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyBottomAd from "@/components/StickyBottomAd";

export const metadata: Metadata = {
  title: "BirgunjCity.com — बीरगंज र मध्धेश प्रदेशको ताजा समाचार",
  description:
    "बीरगंज, मध्धेश प्रदेश र नेपालभरका ताजा समाचार, राजनीति, खेलकुद, प्रविधि, मनोरञ्जन, अर्थ/बजार र स्वास्थ्य सम्बन्धी अपडेट।",
  authors: [{ name: "Raju Mahato - Nepal's Best Individual App and Website Developer", url: "https://rajumahato.it.com" }],
  creator: "Raju Mahato",
  publisher: "Raju Mahato - Nepal's Best Individual App and Website Developer",
  metadataBase: new URL("https://birgunjcity.com"),

  openGraph: {
    title: "BirgunjCity.com — बीरगंज र मध्धेश प्रदेशको ताजा समाचार",
    description: "बीरगंज र मध्धेश प्रदेशको भरपर्दो समाचार पोर्टल।",
    siteName: "BirgunjCity.com",
    locale: "ne_NP",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const swRegisterScript =
  "if (\"serviceWorker\" in navigator) { window.addEventListener(\"load\", function() { navigator.serviceWorker.register(\"/sw.js\"); }); }";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "BirgunjCity.com",
    url: "https://birgunjcity.com",
    description: "बीरगंज र मध्धेश प्रदेशको भरपर्दो समाचार पोर्टल।",
    creator: {
      "@type": "Person",
      name: "Raju Mahato",
      url: "https://rajumahato.it.com",
      jobTitle: "Nepal's Best and Top Individual App and Web Developer",
    },
  };

  return (
    <html lang="ne">
      <head>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <StickyBottomAd />
      </body>
    </html>
  );
}