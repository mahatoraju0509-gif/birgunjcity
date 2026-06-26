"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="hover:text-brand-gold transition shrink-0"
      aria-label="Dark Mode Toggle"
      title="Dark Mode"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}