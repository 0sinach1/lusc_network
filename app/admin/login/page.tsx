"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        setError(data.error || "Authentication failed. Check credentials.");
      }
    } catch (err) {
      setError("Unable to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans flex items-center justify-center p-4 selection:bg-[#C89B59] selection:text-black">
      <div className="w-full max-w-md bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#124642]/30 rounded-full blur-2xl"></div>

        {/* LUSC Crest Branding Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C89B59] via-[#6B5A21] to-[#124642] p-0.5 mx-auto flex items-center justify-center shadow-lg shadow-[#C89B59]/20">
            <div className="w-full h-full bg-[#0D0D0D] rounded-[14px] flex items-center justify-center">
              <span className="text-[#C89B59] font-black text-2xl">⚖️</span>
            </div>
          </div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase">
            LUSC <span className="text-[#C89B59]">Portal Access</span>
          </h1>
          <p className="text-xs text-gray-400">
            Enter provisioned office credentials to access your dashboard.
          </p>
        </div>

        {error && (
          <div className="p-3.5 text-xs bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 font-medium text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. welfare_admin"
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-500 focus:bg-[#1A1A1A] focus:outline-none focus:border-[#C89B59] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-500 focus:bg-[#1A1A1A] focus:outline-none focus:border-[#C89B59] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#C89B59] hover:bg-[#b08443] text-black font-black text-xs rounded-2xl shadow-lg shadow-[#C89B59]/20 disabled:opacity-50 transition-all mt-2"
          >
            {loading ? "Authenticating..." : "Authorize & Sign In"}
          </button>
        </form>

        <div className="pt-4 border-t border-[#6B5A21]/30 text-center text-[10px] text-gray-500 relative z-10">
          Landmark University Student Council Platform • Encrypted JWT Session
        </div>
      </div>
    </div>
  );
}