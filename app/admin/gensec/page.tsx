"use client";

import { useState } from "react";
import Link from "next/link";

export default function GenSecDashboardPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans p-6 md:p-8 selection:bg-[#C89B59] selection:text-black">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-5 px-6 shadow-2xl">
          <div>
            <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
              <Link href="/admin" className="text-[#C89B59] font-bold hover:underline">
                ← Back to Central Hub
              </Link>
              <span>/</span>
              <span className="text-gray-300">General Secretary</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              General Secretary (GenSec) Office
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Official memos, executive minutes, and signed document repository.
            </p>
          </div>
          <span className="bg-[#124642]/40 text-emerald-300 border border-[#124642] text-xs px-3.5 py-1.5 rounded-full font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Office Scope: /admin/gensec
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Form Column */}
          <div className="md:col-span-5 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl h-fit space-y-4">
            <div className="border-b border-[#6B5A21]/30 pb-3">
              <h2 className="text-base font-bold text-white">Archive Official Document</h2>
              <p className="text-[11px] text-gray-400">Save links to authorized council paperwork.</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Memo Ref Code / Name</label>
                <input type="text" placeholder="e.g. LUSC/MEMO/2026/001" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Document Title</label>
                <input type="text" placeholder="e.g. Minutes of Senate General Sitting" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Signed By</label>
                  <input type="text" placeholder="Hon. Gen. Sec" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Session Year</label>
                  <input type="number" defaultValue={2026} className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white focus:outline-none focus:border-[#C89B59]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Document Cloud / Drive Link</label>
                <input type="url" placeholder="https://drive.google.com/..." className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 bg-[#C89B59] hover:bg-[#b08443] text-black font-black text-xs rounded-2xl shadow-lg shadow-[#C89B59]/20 transition-all mt-2">
                Save to Repository
              </button>
            </form>
          </div>

          {/* Registry Column */}
          <div className="md:col-span-7 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl space-y-4 h-fit min-h-[400px]">
            <div className="flex items-center justify-between border-b border-[#6B5A21]/30 pb-3">
              <h2 className="text-base font-bold text-white">Document Repository</h2>
              <span className="text-[10px] font-bold bg-[#C89B59]/10 text-[#C89B59] border border-[#6B5A21]/30 px-3 py-1 rounded-full">
                Archived: 0
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-50">
              <span className="text-4xl">🗄️</span>
              <p className="text-xs text-gray-400">No official documents archived.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}