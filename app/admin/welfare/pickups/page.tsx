"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PickupRequest {
  id: string;
  reference: string;
  studentName: string;
  regNo: string;
  type: "STANDARD" | "EMERGENCY";
  destination: "HALL" | "WELFARE_OFFICE";
  fee: number;
  status: "PENDING" | "DISPATCHED" | "COMPLETED";
  createdAt: string;
}

export default function WelfarePickupsPage() {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchPickups = async () => {
    try {
      const res = await fetch("/api/v1/pickups");
      if (res.ok) {
        const data = await res.json();
        setPickups(data.pickups || []);
      }
    } catch (err) {
      console.error("Failed to load pickups", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/v1/pickups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        fetchPickups();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const pendingCount = pickups.filter((p) => p.status === "PENDING").length;
  const emergencyCount = pickups.filter((p) => p.type === "EMERGENCY").length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/welfare" className="text-xs font-bold text-blue-600 hover:underline">
            ← Back to Welfare Hub
          </Link>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Gate Delivery & Pickups</h1>
          <p className="text-xs text-gray-500">
            Standard & 3-hour emergency package dispatches (Operating hours: 8:00 AM – 8:00 PM).
          </p>
        </div>
        <span className="bg-blue-50 text-blue-600 text-[10px] px-3 py-1.5 rounded-full font-bold border border-blue-100">
          Route: /api/v1/pickups
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Pending Dispatches</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Emergency Requests</p>
          <p className="text-2xl font-black text-red-600 mt-1">{emergencyCount}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Total Queue</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{pickups.length}</p>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
          <h2 className="text-sm font-bold text-gray-900">Delivery Orders</h2>
          <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
            Auto-Sync Active
          </span>
        </div>

        {fetching ? (
          <p className="text-center py-8 text-xs text-gray-400">Loading delivery queue...</p>
        ) : pickups.length === 0 ? (
          <p className="text-center py-8 text-xs text-gray-400">No active pickup requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-50">
                  <th className="pb-2 font-bold">Ref Code</th>
                  <th className="pb-2 font-bold">Student Name</th>
                  <th className="pb-2 font-bold">Type</th>
                  <th className="pb-2 font-bold">Destination & Fee</th>
                  <th className="pb-2 font-bold">Status</th>
                  <th className="pb-2 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pickups.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-mono font-bold text-blue-600">{p.reference}</td>
                    <td className="py-3">
                      <p className="font-bold text-gray-900">{p.studentName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{p.regNo}</p>
                    </td>
                    <td className="py-3">
                      {p.type === "EMERGENCY" ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200">
                          ⚡ 3-Hr Emergency
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="py-3 font-mono font-bold text-gray-800">
                      {p.destination === "HALL" ? "Residence Hall" : "Welfare Office"} (₦{p.fee.toLocaleString()})
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          p.status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : p.status === "DISPATCHED"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 space-x-1">
                      {p.status === "PENDING" && (
                        <button
                          onClick={() => handleStatusUpdate(p.id, "DISPATCHED")}
                          className="px-2.5 py-1 text-[10px] font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Dispatch
                        </button>
                      )}
                      {p.status === "DISPATCHED" && (
                        <button
                          onClick={() => handleStatusUpdate(p.id, "COMPLETED")}
                          className="px-2.5 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}