"use client";

import { useState } from "react";
import Link from "next/link";

export default function LuggageVaultPage() {
  const [step, setStep] = useState<"booking" | "payment" | "ticket">("booking");
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [matric, setMatric] = useState("");
  const [bags, setBags] = useState(1);
  const [ticketId, setTicketId] = useState("");

  const pricePerBag = 500;
  const totalCost = bags * pricePerBag;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handleProcessPayment = () => {
    setLoading(true);
    // Simulate payment gateway delay (e.g. Paystack / Flutterwave)
    setTimeout(() => {
      setTicketId(`LUSC-LUG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      setLoading(false);
      setStep("ticket");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans selection:bg-[#C89B59] selection:text-black flex flex-col">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#6B5A21]/30">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="text-[#C89B59] font-black text-xl">⚖️</span>
            <div>
              <p className="text-sm font-black text-white uppercase tracking-wider">LUSC <span className="text-[#C89B59]">Vault</span></p>
            </div>
          </Link>
          <span className="px-3 py-1 bg-[#124642]/40 text-emerald-300 border border-[#124642] text-[10px] font-bold rounded-full uppercase tracking-widest">
            VCM Directorate
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 py-12 relative overflow-hidden">
        {/* Ambient Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C89B59]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-lg relative z-10">
          
          {step === "booking" && (
            <div className="bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-black text-white">Digital Luggage Booking</h1>
                <p className="text-xs text-gray-400">Secure your luggage during the break. ₦{pricePerBag} per bag.</p>
              </div>

              <form onSubmit={handleProceedToPayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Student Name" className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-sm text-white focus:outline-none focus:border-[#C89B59]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Matric Number</label>
                  <input type="text" required value={matric} onChange={(e) => setMatric(e.target.value)} placeholder="e.g. 210..." className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-sm text-white focus:outline-none focus:border-[#C89B59]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Number of Bags</label>
                  <input type="number" min="1" max="10" required value={bags} onChange={(e) => setBags(parseInt(e.target.value) || 1)} className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-sm text-white focus:outline-none focus:border-[#C89B59]" />
                </div>

                <div className="pt-4 border-t border-[#6B5A21]/30 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-400">Total Cost</span>
                  <span className="text-xl font-black text-[#C89B59]">₦{totalCost.toLocaleString()}</span>
                </div>

                <button type="submit" className="w-full py-3.5 bg-[#C89B59] hover:bg-[#b08443] text-black font-black text-sm rounded-2xl shadow-lg shadow-[#C89B59]/20 transition-all mt-4">
                  Proceed to Payment
                </button>
              </form>
            </div>
          )}

          {step === "payment" && (
            <div className="bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-center">
              <div className="w-16 h-16 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-full flex items-center justify-center mx-auto text-2xl">
                💳
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Secure Checkout</h2>
                <p className="text-xs text-gray-400 mt-1">You are paying for {bags} luggage item(s).</p>
              </div>
              <div className="text-3xl font-black text-[#C89B59] py-4">
                ₦{totalCost.toLocaleString()}
              </div>
              <div className="space-y-3">
                <button onClick={handleProcessPayment} disabled={loading} className="w-full py-3.5 bg-white hover:bg-gray-200 text-black font-black text-sm rounded-2xl transition-all flex justify-center items-center gap-2">
                  {loading ? <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : "Pay via Paystack / Card"}
                </button>
                <button onClick={() => setStep("booking")} disabled={loading} className="w-full py-3 bg-transparent text-xs font-bold text-gray-500 hover:text-white transition-colors">
                  Cancel & Go Back
                </button>
              </div>
            </div>
          )}

          {step === "ticket" && (
            <div className="bg-[#141414] border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C89B59] to-emerald-400" />
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-xl font-black mb-4">
                  ✓
                </div>
                <h2 className="text-xl font-black text-white">Payment Successful!</h2>
                <p className="text-xs text-gray-400">Present this digital ticket at the VCM luggage drop-off point.</p>
              </div>

              <div className="bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between border-b border-[#6B5A21]/20 pb-3">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Ticket ID</span>
                  <span className="text-xs font-mono font-black text-[#C89B59]">{ticketId}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-500">Name</span>
                    <span className="text-sm font-bold text-white">{name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-500">Matric No</span>
                    <span className="text-sm font-bold text-white">{matric}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-500">Luggage Count</span>
                    <span className="text-sm font-bold text-emerald-400">{bags} Bag(s)</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-500">Status</span>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 uppercase">Awaiting Drop-off</span>
                  </div>
                </div>
              </div>

              <button onClick={() => window.print()} className="w-full py-3 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-[#6B5A21]/40 text-[#C89B59] font-bold text-xs rounded-xl transition-all">
                Download / Print Ticket
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}