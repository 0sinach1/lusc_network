"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface AdminAccount {
  id: string;
  username: string;
  office: string;
  role: string;
  createdAt: string;
}

const OFFICE_OPTIONS = [
  { label: "Vice Chairman (VCM)", office: "VCM", role: "vcm" },
  { label: "Welfare Office", office: "Welfare", role: "welfare" },
  { label: "Public Relations (PRO)", office: "PRO", role: "pro" },
  { label: "General Secretary", office: "GenSec", role: "gensec" },
  { label: "Chairman & Squad", office: "Chairman", role: "chairman" },
  { label: "Vice Chairman Financials", office: "VCF", role: "vcf" },
  { label: "Sports Office", office: "Sports", role: "sports" },
  { label: "Super Admin", office: "SuperAdmin", role: "super" },
];

export default function SuperAdminAccountsPage() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedOffice, setSelectedOffice] = useState(OFFICE_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/v1/super/accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/v1/super/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          office: selectedOffice.office,
          role: selectedOffice.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(`Account "${username}" provisioned successfully!`);
        setUsername("");
        setPassword("");
        fetchAccounts();
      } else {
        setError(data.error || "Failed to provision account.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoidAccount = async (id: string, targetUsername: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to void credentials for "${targetUsername}"? This will terminate their access immediately.`
    );
    if (!confirmed) return;

    setRevokingId(id);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/v1/super/accounts?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || `Credentials for "${targetUsername}" voided.`);
        fetchAccounts();
      } else {
        setError(data.error || "Failed to void credentials.");
      }
    } catch (err) {
      setError("An error occurred while voiding the account.");
    } finally {
      setRevokingId(null);
    }
  };

  const uniqueProvisionedOffices = new Set(accounts.map((acc) => acc.office)).size;
  const totalOffices = OFFICE_OPTIONS.length;
  const coveragePercent = Math.round((uniqueProvisionedOffices / totalOffices) * 100);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans p-6 md:p-8 selection:bg-[#C89B59] selection:text-black">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-5 px-6 shadow-2xl">
          <div>
            <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
              <Link href="/admin/super" className="text-[#C89B59] font-bold hover:underline">
                ← HQ Dashboard
              </Link>
              <span>/</span>
              <span className="text-gray-300">Account Delegation</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Admin Account Governance
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Provision new credentials or void active access across council offices.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="bg-[#124642]/40 text-emerald-300 border border-[#124642] text-xs px-3.5 py-1.5 rounded-full font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Supabase Sync
            </span>
          </div>
        </div>

        {/* Dynamic Metric Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#141414] p-5 rounded-3xl border border-[#6B5A21]/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Total Admin Accounts
              </span>
              <span className="p-1.5 rounded-xl bg-[#C89B59]/10 text-[#C89B59] text-xs">🔑</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-black text-white">{accounts.length}</p>
              <span className="text-xs font-bold text-[#C89B59] bg-[#C89B59]/10 px-2.5 py-1 rounded-lg border border-[#6B5A21]/30">
                {fetching ? "Syncing..." : `${accounts.length} Active`}
              </span>
            </div>
          </div>

          <div className="bg-[#141414] p-5 rounded-3xl border border-[#6B5A21]/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Delegated Offices
              </span>
              <span className="p-1.5 rounded-xl bg-[#124642]/50 text-emerald-400 text-xs">🏛️</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-black text-white">
                {uniqueProvisionedOffices} <span className="text-xs font-normal text-gray-500">/ {totalOffices}</span>
              </p>
              <span className="text-xs font-bold text-emerald-400 bg-[#124642]/30 px-2.5 py-1 rounded-lg border border-[#124642]">
                {coveragePercent}% Covered
              </span>
            </div>
          </div>

          <div className="bg-[#141414] p-5 rounded-3xl border border-[#6B5A21]/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Security Protocol
              </span>
              <span className="p-1.5 rounded-xl bg-[#124642]/50 text-emerald-400 text-xs">🛡️</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-xl font-black text-white">JWT + bcrypt</p>
              <span className="text-xs font-bold text-emerald-400 bg-[#124642]/30 px-2.5 py-1 rounded-lg border border-[#124642]">
                Strict Edge Auth
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3.5 text-xs bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 font-medium flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button onClick={() => setError("")} className="text-red-400 font-bold hover:underline">✕</button>
          </div>
        )}
        {success && (
          <div className="p-3.5 text-xs bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 font-medium flex items-center justify-between">
            <span>✓ {success}</span>
            <button onClick={() => setSuccess("")} className="text-emerald-400 font-bold hover:underline">✕</button>
          </div>
        )}

        {/* Main Columns */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Form */}
          <div className="col-span-12 lg:col-span-4 bg-[#141414] p-6 rounded-3xl border border-[#6B5A21]/40 shadow-xl space-y-4">
            <div className="border-b border-[#6B5A21]/30 pb-3">
              <h2 className="text-base font-bold text-white">Issue New Credential</h2>
              <p className="text-[11px] text-gray-400">Assign a password and role prefix to an office.</p>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. welfare_admin"
                  className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C89B59] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C89B59] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Office Role & Scope Prefix</label>
                <select
                  value={selectedOffice.office}
                  onChange={(e) => {
                    const match = OFFICE_OPTIONS.find((opt) => opt.office === e.target.value);
                    if (match) setSelectedOffice(match);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white focus:outline-none focus:border-[#C89B59] transition-all"
                >
                  {OFFICE_OPTIONS.map((opt) => (
                    <option key={opt.office} value={opt.office} className="bg-[#141414] text-white">
                      {opt.label} (/admin/{opt.role})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#C89B59] hover:bg-[#b08443] text-black font-black text-xs rounded-2xl shadow-lg shadow-[#C89B59]/20 disabled:opacity-50 transition-all"
              >
                {loading ? "Provisioning..." : "Provision Admin Account"}
              </button>
            </form>
          </div>

          {/* Directory & Void Table */}
          <div className="col-span-12 lg:col-span-8 bg-[#141414] p-6 rounded-3xl border border-[#6B5A21]/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#6B5A21]/30 pb-3">
              <div>
                <h2 className="text-base font-bold text-white">Provisioned Admins</h2>
                <p className="text-[11px] text-gray-400">Active accounts and access revocation.</p>
              </div>
              <span className="text-[10px] font-bold bg-[#C89B59]/10 text-[#C89B59] border border-[#6B5A21]/30 px-3 py-1 rounded-full">
                {accounts.length} Active
              </span>
            </div>

            {fetching ? (
              <p className="text-center py-12 text-xs text-gray-500">Loading accounts...</p>
            ) : accounts.length === 0 ? (
              <p className="text-center py-12 text-xs text-gray-500">No accounts provisioned yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-400 border-b border-[#6B5A21]/20">
                      <th className="pb-3 font-bold">User</th>
                      <th className="pb-3 font-bold">Office</th>
                      <th className="pb-3 font-bold">Route Lock</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#6B5A21]/20">
                    {accounts.map((acc) => {
                      const isSuper = acc.username === "superadmin" || acc.role === "super";
                      return (
                        <tr key={acc.id} className="hover:bg-[#0D0D0D]/60 transition-colors">
                          <td className="py-3 font-bold text-white">{acc.username}</td>
                          <td className="py-3 text-gray-300">{acc.office}</td>
                          <td className="py-3">
                            <span className="font-mono text-[10px] bg-[#C89B59]/10 text-[#C89B59] border border-[#6B5A21]/30 px-2.5 py-1 rounded-lg font-bold">
                              /admin/{acc.role}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {isSuper ? (
                              <span className="text-[10px] text-gray-500 italic">Protected</span>
                            ) : (
                              <button
                                onClick={() => handleVoidAccount(acc.id, acc.username)}
                                disabled={revokingId === acc.id}
                                className="px-3 py-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold transition-all disabled:opacity-50"
                              >
                                {revokingId === acc.id ? "Voiding..." : "Void Access"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}