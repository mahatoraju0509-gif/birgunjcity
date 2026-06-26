"use client";

import { useState } from "react";

export default function FontSizeControl({ children }: { children: React.ReactNode }) {
  const [size, setSize] = useState(100);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
        <span>अक्षर साइज:</span>
        <button
          onClick={() => setSize((s) => Math.max(80, s - 10))}
          className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-xs"
        >
          A-
        </button>
        <span className="text-xs w-10 text-center">{size}%</span>
        <button
          onClick={() => setSize((s) => Math.min(150, s + 10))}
          className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-xs"
        >
          A+
        </button>
      </div>
      <div style={{ fontSize: size + "%" }}>{children}</div>
    </div>
  );
}