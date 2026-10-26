"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Donation {
  id: string;
  donorName: string;
  amount: number | null;
  item: string | null;
  dateReceived: string;
  loggedBy: string;
}

export default function WelfareDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDonations = async () => {
    try {
      const res = await fetch("/api/v1/welfare/donations");
      if (res.ok) {
        const data = await res.json();
        setDonations(data.donations || []);
      }
    } catch (err) {
      console.error("Failed to fetch donations:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleLogDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/v1/welfare/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorName, amount, item }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(`Donation from "${donorName}" logged successfully!`);
        setDonorName("");
        setAmount("");
        setItem("");
        fetchDonations();
      } else {
        setError(data.error || "Failed to log donation.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const totalCash = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/welfare" className="text-xs font-bold text-blue-600 hover:underline">
            ← Back to Welfare Hub
          </Link>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Donations Ledger</h1>
          <p className="text-xs text-gray-500">Record and track item & financial donations.</p>
        </div>
        <span className="bg-blue-50 text-blue-600 text-[10px] px-3 py-1.5 rounded-full font-bold border border-blue-100">
          Total Logged: ₦{totalCash.toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Form */}
        <div className="col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-3">
            Log New Donation
          </h2>

          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-xs bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              {success}
            </div>
          )}

          <form onSubmit={handleLogDonation} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Donor Name</label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Alumni Class of '20 / Hon. Anonymous"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Amount (₦) - Optional</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Item / Supplies Description - Optional</label>
              <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g. 5 boxes of medical supplies / text books"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 disabled:opacity-50 transition-all"
            >
              {loading ? "Logging..." : "Save Donation Record"}
            </button>
          </form>
        </div>

        {/* Directory */}
        <div className="col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <h2 className="text-base font-bold text-gray-900">Recent Donations</h2>
            <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
              Count: {donations.length}
            </span>
          </div>

          {fetching ? (
            <p className="text-center py-8 text-xs text-gray-400">Loading donations...</p>
          ) : donations.length === 0 ? (
            <p className="text-center py-8 text-xs text-gray-400">No donations logged yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-50">
                    <th className="pb-2 font-bold">Donor</th>
                    <th className="pb-2 font-bold">Amount</th>
                    <th className="pb-2 font-bold">Item Description</th>
                    <th className="pb-2 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-bold text-gray-900">{d.donorName}</td>
                      <td className="py-2.5 font-mono text-emerald-600 font-bold">
                        {d.amount ? `₦${d.amount.toLocaleString()}` : "-"}
                      </td>
                      <td className="py-2.5 text-gray-600">{d.item || "-"}</td>
                      <td className="py-2.5 text-gray-400 text-[10px]">
                        {new Date(d.dateReceived).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}