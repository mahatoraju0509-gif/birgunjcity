import Link from "next/link";
import { CATEGORIES } from "@/types/article";

export default function Footer() {
  return (
    <footer className="bg-brand-navy-dark text-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-extrabold mb-3">
            BIRGUNJ<span className="text-brand-gold">CITY</span>.com
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            बीरगंज र मध्धेश प्रदेशको भरपर्दो, विश्वसनीय र छिटो समाचार पोर्टल।
          </p>
          <div className="flex gap-3 mt-4 text-xl">
            <a href="#" aria-label="Facebook" className="hover:text-brand-gold">📘</a>
            <a href="#" aria-label="YouTube" className="hover:text-brand-gold">▶️</a>
            <a href="#" aria-label="Instagram" className="hover:text-brand-gold">📷</a>
            <a href="https://wa.me/8109036694264" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-green-400">💬</a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-brand-gold">समाचार</h4>
          <ul className="text-sm text-gray-300 space-y-2">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <Link href={"/category/" + cat.id} className="hover:text-brand-gold transition">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-brand-gold">अन्य खण्ड</h4>
          <ul className="text-sm text-gray-300 space-y-2 mb-3">
            <li><Link href="/gallery" className="hover:text-brand-gold transition">फोटो ग्यालरी</Link></li>
          </ul>
          <ul className="text-sm text-gray-300 space-y-2">
            {CATEGORIES.slice(5, 10).map((cat) => (
              <li key={cat.id}>
                <Link href={"/category/" + cat.id} className="hover:text-brand-gold transition">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-brand-gold">सम्पर्क</h4>
          <p className="text-sm text-gray-300 mb-2">समाचार पठाउनुहोस्:</p>
          <p className="text-sm text-brand-gold mb-4">news@birgunjcity.com</p>
          <p className="text-sm text-gray-300">विज्ञापनको लागि सम्पर्क गर्नुहोस्</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} BirgunjCity.com — सर्वाधिकार सुरक्षित</p>
        <p className="mt-1 flex items-center justify-center gap-2 flex-wrap">
          <span>Designed & Developed by</span>
          <a
            href="https://rajumahato.it.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-gold font-semibold hover:underline"
          >
            Raju Mahato
          </a>
          <span>— Nepal&apos;s Best &amp; Top Individual App and Web Developer</span>
          <a
            href="https://wa.me/8109036694264"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300"
            aria-label="WhatsApp"
          >
            💬
          </a>
        </p>
      </div>
    </footer>
  );
}