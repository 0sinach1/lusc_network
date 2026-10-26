"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, getSessionRole } from "@/app/actions/auth";

export default function WelfareDashboardPage() {
  const router = useRouter();

  // Auth state
  const [userRole, setUserRole] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"applications" | "pickups" | "donations">("applications");
  const [loading, setLoading] = useState(false);

  // Fetch the actual role from the JWT on mount
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = await getSessionRole();
        setUserRole(role || "staff"); 
      } catch (err) {
        console.error("Failed to fetch role, defaulting to staff", err);
        setUserRole("staff");
      }
    };
    fetchRole();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans p-6 md:p-8 selection:bg-[#C89B59] selection:text-black">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Dynamic Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-5 px-6 shadow-2xl">
          <div>
            <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
              
              {/* Bulletproof Conditional Rendering */}
              {userRole === null ? (
                <span className="text-gray-600 font-bold flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                  Checking Auth...
                </span>
              ) : userRole === "superadmin" ? (
                <Link href="/admin" className="text-[#C89B59] font-bold hover:underline">
                  ← Back to Central Hub
                </Link>
              ) : (
                <button 
                  onClick={handleLogout} 
                  className="text-red-400 font-bold hover:underline flex items-center gap-1"
                >
                  ← Log Out
                </button>
              )}

              <span>/</span>
              <span className="text-gray-300">Welfare Directorate</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Welfare Office Management
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage student support funds, emergency pickups, and the donations ledger.
            </p>
          </div>
          <span className="bg-[#124642]/40 text-emerald-300 border border-[#124642] text-xs px-3.5 py-1.5 rounded-full font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Office Scope: /admin/welfare
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-[#141414] p-1.5 rounded-2xl border border-[#6B5A21]/30 max-w-2xl">
          {[
            { id: "applications", label: "Fund Applications", icon: "📄" },
            { id: "pickups", label: "Gate Pickups", icon: "📦" },
            { id: "donations", label: "Donations Ledger", icon: "🤝" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id ? "bg-[#C89B59] text-black shadow-md" : "text-gray-400 hover:text-white hover:bg-[#0D0D0D]"
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Form Column */}
          <div className="md:col-span-5 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl h-fit space-y-4">
            <div className="border-b border-[#6B5A21]/30 pb-3">
              <h2 className="text-base font-bold text-white capitalize">
                {activeTab === "applications" ? "Log Support Request" : activeTab === "pickups" ? "Register Gate Pickup" : "Record Donation"}
              </h2>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {activeTab === "applications" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">Student Name</label>
                    <input type="text" placeholder="Applicant Name" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">Support Reason</label>
                    <textarea rows={3} placeholder="Medical, feeding, emergency..." className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                  </div>
                </>
              )}

              {activeTab === "pickups" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">Recipient Name & Matric</label>
                    <input type="text" placeholder="e.g. John Doe (210...)" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">Package Details</label>
                    <input type="text" placeholder="Provisions, Documents..." className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                  </div>
                </>
              )}

              {activeTab === "donations" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">Donor Name (or Anonymous)</label>
                    <input type="text" placeholder="Name or Organization" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">Amount / Item</label>
                    <input type="text" placeholder="e.g. ₦50,000 or 10 Cartons of Indomie" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                  </div>
                </>
              )}

              <button type="submit" disabled={loading} className="w-full py-3 bg-[#C89B59] hover:bg-[#b08443] text-black font-black text-xs rounded-2xl shadow-lg shadow-[#C89B59]/20 transition-all mt-2">
                Submit Record
              </button>
            </form>
          </div>

          {/* Registry Column */}
          <div className="md:col-span-7 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl space-y-4 h-fit min-h-[400px]">
            <div className="flex items-center justify-between border-b border-[#6B5A21]/30 pb-3">
              <h2 className="text-base font-bold text-white capitalize">Active {activeTab}</h2>
              <span className="text-[10px] font-bold bg-[#C89B59]/10 text-[#C89B59] border border-[#6B5A21]/30 px-3 py-1 rounded-full">
                Count: 0
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-50">
              <span className="text-4xl">
                {activeTab === "applications" ? "📄" : activeTab === "pickups" ? "📦" : "🤝"}
              </span>
              <p className="text-xs text-gray-400">No records found for this category.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}