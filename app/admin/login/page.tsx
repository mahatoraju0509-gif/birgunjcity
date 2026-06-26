"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch {
      setError("Email वा Password मिलेन। फेरि प्रयास गर्नुहोस्।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-brand-navy mb-1 text-center">
          BIRGUNJ<span className="text-brand-gold">CITY</span>
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">Admin Panel Login</p>
        {error && <div className="bg-red-50 text-red-600 text-sm p-2 rounded mb-4">{error}</div>}
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-navy" />
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-brand-navy" />
        <button type="submit" disabled={loading} className="w-full bg-brand-navy text-white font-semibold py-2 rounded-lg hover:bg-brand-navy-light transition disabled:opacity-50">
          {loading ? "Login हुँदैछ..." : "Login"}
        </button>
      </form>
    </div>
  );
}