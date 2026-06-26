"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border bg-white border-gray-300 text-gray-600 hover:bg-gray-50 transition print:hidden"
    >
      🖨️ Print
    </button>
  );
}