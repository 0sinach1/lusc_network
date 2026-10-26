"use client";

import React from "react";
import Link from "next/link";

export default function SuperAdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans p-6 md:p-8 selection:bg-[#C89B59] selection:text-black">
      <div className="max-w-[1500px] mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-2xl">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#C89B59] mb-1 font-bold">
              <Link href="/admin" className="hover:underline">
                ← Central Hub
              </Link>
              <span className="text-gray-600">/</span>
              <span className="text-gray-300">Super Admin Governance</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Super Admin Executive Portal
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Global system administration, credential provisioning, and platform security.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="bg-[#124642]/40 text-emerald-300 border border-[#124642] text-xs px-4 py-2 rounded-full font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              DevOps Tier Active
            </span>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/super/accounts"
            className="group relative overflow-hidden bg-[#141414] border border-[#6B5A21]/40 hover:border-[#C89B59] rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-[#C89B59]/10 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="p-3 rounded-2xl bg-[#0D0D0D] border border-[#6B5A21]/40 text-xl">
                🔑
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#124642]/40 text-[#C89B59] border border-[#124642]">
                Credentials
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white group-hover:text-[#C89B59] transition-colors">
                Account Governance
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Provision hashed passwords and assign office role scope prefixes.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#C89B59]">
              <span>Manage Accounts</span>
              <span>➔</span>
            </div>
          </Link>

          <div className="bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-3 rounded-2xl bg-[#0D0D0D] border border-[#6B5A21]/40 text-xl">
                📜
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#124642]/40 text-[#C89B59] border border-[#124642]">
                Certificates
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Certificate Issuer</h2>
              <p className="text-xs text-gray-400 mt-1">
                Generate verified student certificates with UUIDv4 non-sequential codes.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-[#C89B59]">
              <span>Active Scope</span>
            </div>
          </div>

          <div className="bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-3 rounded-2xl bg-[#0D0D0D] border border-[#6B5A21]/40 text-xl">
                🏛️
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#124642]/40 text-[#C89B59] border border-[#124642]">
                Registry
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Council Directory</h2>
              <p className="text-xs text-gray-400 mt-1">
                Track internal and external council members and attendance standing.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-[#C89B59]">
              <span>Active Scope</span>
            </div>
          </div>
        </div>

        {/* Global Security Metrics Panel */}
        <div className="bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-black text-[#C89B59] uppercase tracking-wider border-b border-[#6B5A21]/30 pb-3">
            System Infrastructure & Security Isolation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#6B5A21]/30 space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Database Layer</p>
              <p className="font-bold text-white">Supabase / PostgreSQL</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#6B5A21]/30 space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Auth Encryption</p>
              <p className="font-bold text-white">bcryptjs + jose JWT</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#6B5A21]/30 space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Route Protection</p>
              <p className="font-bold text-emerald-400">Edge Middleware</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#6B5A21]/30 space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Theme Engine</p>
              <p className="font-bold text-[#C89B59]">Obsidian & Gold Seal</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}