"use client";

import { useState } from "react";
import Link from "next/link";
import { updateLuggagePrice } from "@/app/actions/settings";

export default function VcmDashboardPage() {
  const [activeTab, setActiveTab] = useState<"certificates" | "luggage">("certificates");
  const [loading, setLoading] = useState(false);
  
  // Price update state
  const [newPrice, setNewPrice] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock Active Luggage Database
  const mockLuggage = [
    { id: "LUSC-LUG-9A2X1", name: "Ifeanyi Osinachi", bags: 2, status: "Stored", date: "Oct 19, 2026" },
    { id: "LUSC-LUG-4B8Y7", name: "David Adeleke", bags: 1, status: "Awaiting Drop-off", date: "Oct 19, 2026" },
  ];

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const priceNumber = parseInt(newPrice);
    if (!isNaN(priceNumber)) {
      await updateLuggagePrice(priceNumber);
      alert(`Price successfully updated to ₦${priceNumber}`);
      setNewPrice("");
    }
    
    setIsUpdating(false);
  };

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
              <span className="text-gray-300">Vice Chairman</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Vice Chairman (VCM) Portal
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage cryptographic certificates and digital luggage vault operations.
            </p>
          </div>
          <span className="bg-[#124642]/40 text-emerald-300 border border-[#124642] text-xs px-3.5 py-1.5 rounded-full font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Office Scope: /admin/vcm
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-[#141414] p-1.5 rounded-2xl border border-[#6B5A21]/30 max-w-md">
          <button
            onClick={() => setActiveTab("certificates")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "certificates" ? "bg-[#C89B59] text-black shadow-md" : "text-gray-400 hover:text-white hover:bg-[#0D0D0D]"
            }`}
          >
            📜 Certificate Issuer
          </button>
          <button
            onClick={() => setActiveTab("luggage")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "luggage" ? "bg-[#C89B59] text-black shadow-md" : "text-gray-400 hover:text-white hover:bg-[#0D0D0D]"
            }`}
          >
            🧳 Luggage Vault
          </button>
        </div>

        {/* Workspace Area */}
        {activeTab === "certificates" ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Certificate Form */}
            <div className="md:col-span-5 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl h-fit space-y-4">
              <div className="border-b border-[#6B5A21]/30 pb-3">
                <h2 className="text-base font-bold text-white">Issue Official Certificate</h2>
              </div>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Recipient Name</label>
                  <input type="text" placeholder="Full Student / Member Name" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Honor / Title</label>
                  <textarea rows={3} placeholder="e.g. Certificate of Service..." className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#C89B59] text-black font-black text-xs rounded-2xl shadow-lg transition-all mt-2">
                  Generate Credential
                </button>
              </form>
            </div>
            
            {/* Certificate Ledger */}
            <div className="md:col-span-7 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl space-y-4 min-h-[400px]">
               <div className="border-b border-[#6B5A21]/30 pb-3">
                <h2 className="text-base font-bold text-white">Issued Ledger</h2>
              </div>
              <p className="text-xs text-gray-500 text-center py-10">Ledger connected. Ready for issuance.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            
            {/* Luggage Vault Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl space-y-2">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Active Storage</p>
                <p className="text-3xl font-black text-white">3 <span className="text-sm text-[#C89B59]">Bags</span></p>
              </div>
              <div className="bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl space-y-2">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Pending Drops</p>
                <p className="text-3xl font-black text-white">1 <span className="text-sm text-[#C89B59]">Ticket</span></p>
              </div>
              <div className="bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl space-y-2">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Est. Revenue</p>
                <p className="text-3xl font-black text-emerald-400">₦1,500</p>
              </div>
              {/* Admin Price Control Box */}
              <div className="bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl space-y-2">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Base Price</p>
                <form onSubmit={handleUpdatePrice} className="flex gap-2">
                  <select 
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#C89B59] cursor-pointer" 
                  >
                    <option value="" disabled>Select Price</option>
                    {[...Array(16)].map((_, i) => {
                      const price = 500 + (i * 100);
                      return <option key={price} value={price}>₦{price}</option>;
                    })}
                  </select>
                  <button 
                    type="submit" 
                    disabled={isUpdating}
                    className="px-4 py-2 bg-[#C89B59] text-black font-black text-xs rounded-xl hover:bg-[#b08443] transition-all"
                  >
                    {isUpdating ? "..." : "Save"}
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#6B5A21]/30 pb-4 mb-2">
                <h2 className="text-base font-bold text-white">Active Luggage Tickets</h2>
                <input type="text" placeholder="Scan or Type Ticket ID..." className="px-4 py-2 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#C89B59] w-64" />
              </div>

              <div className="space-y-3">
                {mockLuggage.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-[#0D0D0D] border border-[#6B5A21]/30 rounded-2xl hover:border-[#C89B59]/50 transition-all">
                    <div>
                      <p className="font-bold text-white text-sm">{item.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-[10px]">
                        <span className="font-mono text-[#C89B59]">{item.id}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400">{item.bags} Bag(s)</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {item.status === "Stored" ? (
                        <span className="px-3 py-1 bg-[#124642]/30 text-emerald-400 border border-[#124642] rounded-lg text-[10px] font-black uppercase">
                          In Vault
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-black uppercase">
                          Awaiting Drop
                        </span>
                      )}
                      <button className="px-4 py-2 bg-[#141414] border border-[#6B5A21]/40 hover:bg-[#1A1A1A] text-[#C89B59] rounded-xl text-[10px] font-bold transition-all">
                        Mark Claimed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}