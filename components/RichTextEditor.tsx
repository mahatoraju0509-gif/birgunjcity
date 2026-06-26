"use client";

import { useRef, useEffect } from "react";

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  function exec(command: string, arg?: string) {
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  }

  return (
    <div>
      <div className="flex gap-2 mb-2 p-2 bg-gray-100 rounded-lg flex-wrap">
        <button type="button" onClick={() => exec("bold")} className="px-3 py-1 bg-white border rounded font-bold text-sm hover:bg-gray-50">
          B
        </button>
        <button type="button" onClick={() => exec("italic")} className="px-3 py-1 bg-white border rounded italic text-sm hover:bg-gray-50">
          I
        </button>
        <button type="button" onClick={() => exec("underline")} className="px-3 py-1 bg-white border rounded underline text-sm hover:bg-gray-50">
          U
        </button>
        <button type="button" onClick={() => exec("foreColor", "#dc2626")} className="px-3 py-1 bg-white border rounded text-sm text-red-600 font-bold hover:bg-gray-50">
          रातो
        </button>
        <button type="button" onClick={() => exec("foreColor", "#2563eb")} className="px-3 py-1 bg-white border rounded text-sm text-blue-600 font-bold hover:bg-gray-50">
          निलो
        </button>
        <button type="button" onClick={() => exec("foreColor", "#16a34a")} className="px-3 py-1 bg-white border rounded text-sm text-green-600 font-bold hover:bg-gray-50">
          हरियो
        </button>
        <button type="button" onClick={() => exec("foreColor", "#000000")} className="px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50">
          सामान्य
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={() => {
          if (ref.current) onChange(ref.current.innerHTML);
        }}
        className="w-full border rounded-lg px-3 py-2 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-brand-navy"
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
}