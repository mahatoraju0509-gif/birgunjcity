"use client";

import { useEffect, useRef, useState } from "react";

export default function FooterLogo() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-2xl font-extrabold mb-3">
      <span className={visible ? "animate-slide-left inline-block" : "inline-block opacity-0"}>
        BIRGUNJ
      </span>
      <span className={"text-brand-gold inline-block " + (visible ? "animate-slide-right" : "opacity-0")}>
        CITY
      </span>
      .com
    </div>
  );
}