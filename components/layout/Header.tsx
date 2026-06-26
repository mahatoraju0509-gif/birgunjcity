import Link from "next/link";
import { CATEGORIES } from "@/types/article";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 shadow-lg">
      <div className="bg-brand-navy-dark text-white text-xs py-1.5 px-4 flex justify-between items-center overflow-x-auto">
        <span className="whitespace-nowrap">
          {new Date().toLocaleDateString("ne-NP", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </span>
        <div className="flex items-center gap-4 whitespace-nowrap">
          <span>बीरगंज, नेपाल</span>
          <a href="https://wa.me/8109036694264" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold">
            समाचार पठाउनुहोस्
          </a>
        </div>
      </div>

      <div className="bg-brand-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
              <span className="logo-shine">BIRGUNJ</span><span className="text-brand-gold">CITY</span>
              <span className="text-sm font-normal align-top text-white">.com</span>
            </span>
          </Link>

          <form action="/search" method="GET" className="hidden sm:flex flex-1 max-w-xs">
            <input
              type="text"
              name="q"
              placeholder="समाचार खोज्नुहोस्..."
              className="w-full rounded-full px-4 py-1.5 text-sm text-brand-navy focus:outline-none"
            />
          </form>

          <Link href="/search" className="sm:hidden hover:text-brand-gold transition" aria-label="Search">
            🔍
          </Link>
          <Link href="/saved" className="hover:text-brand-gold transition shrink-0" aria-label="Saved">
            🔖
          </Link>
          <DarkModeToggle />
        </div>

        <nav className="hidden md:block border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 overflow-x-auto text-sm font-medium">
            <Link href="/" className="px-3 py-2.5 hover:bg-white/10 hover:text-brand-gold transition whitespace-nowrap">
              गृहपृष्ठ
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={"/category/" + cat.id}
                className="px-3 py-2.5 hover:bg-white/10 hover:text-brand-gold transition whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <nav className="md:hidden bg-brand-navy-dark text-white overflow-x-auto">
        <div className="flex gap-1 px-2 py-2 text-sm whitespace-nowrap">
          <Link href="/" className="px-3 py-1.5 rounded hover:bg-white/10">गृहपृष्ठ</Link>
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={"/category/" + cat.id} className="px-3 py-1.5 rounded hover:bg-white/10">
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}