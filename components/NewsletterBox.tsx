"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/articles";

export default function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      await subscribeNewsletter(email);
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-brand-navy rounded-xl p-6 text-white text-center my-10">
      <h3 className="text-lg font-bold mb-1">दैनिक समाचार ईमेलमा पाउनुहोस्</h3>
      <p className="text-sm text-white/70 mb-4">तपाईंको ईमेल राखी ताजा अपडेट प्राप्त गर्नुहोस्</p>

      {status === "done" ? (
        <p className="text-brand-gold font-medium">✓ धन्यवाद! तपाईं सफलतापूर्वक subscribe हुनुभयो।</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="तपाईंको ईमेल"
            required
            className="flex-1 rounded-full px-4 py-2 text-brand-navy bg-white placeholder-gray-400 text-sm focus:outline-none border-2 border-transparent focus:border-brand-gold"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-brand-gold text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {status === "loading" ? "..." : "जोडिनुहोस्"}
          </button>
        </form>
      )}
      {status === "error" && <p className="text-red-300 text-xs mt-2">समस्या भयो, फेरि प्रयास गर्नुहोस्।</p>}
    </div>
  );
}