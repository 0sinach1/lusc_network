"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CouncilMember {
  id: string;
  name: string;
  category: "INTERNAL" | "EXTERNAL";
  role: string;
  contact?: string;
  createdAt: string;
}

export default function CouncilMembersPage() {
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [idNumber, setIdNumber] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"INTERNAL" | "EXTERNAL">("INTERNAL");
  const [role, setRole] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/v1/super/council-members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error("Failed to load council members", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Auto-generate suggested ID prefix based on category
  const handleCategoryChange = (newCat: "INTERNAL" | "EXTERNAL") => {
    setCategory(newCat);
    const count = members.filter((m) => m.category === newCat).length + 1;
    const formattedNum = String(count).padStart(4, "0");
    const prefix = newCat === "INTERNAL" ? "LUSC-INT" : "LUSC-EXT";
    setIdNumber(`${prefix}-${formattedNum}`);
  };

  useEffect(() => {
    if (!idNumber && members.length >= 0) {
      handleCategoryChange("INTERNAL");
    }
  }, [fetching]);

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/v1/super/council-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idNumber, name, category, role, contact }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(`Council Member "${name}" registered with ID ${idNumber}!`);
        setName("");
        setRole("");
        setContact("");
        fetchMembers();
      } else {
        setError(data.error || "Failed to register council member");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/super/accounts" className="text-xs font-bold text-blue-600 hover:underline">
            ← Back to Super Admin
          </Link>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Council Member Database</h1>
          <p className="text-xs text-gray-500">
            Internal officers & external council registry with manual hierarchy IDs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Register Member Form */}
        <div className="col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-3">
            Register Council Member
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

          <form onSubmit={handleCreateMember} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCategoryChange("INTERNAL")}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    category === "INTERNAL"
                      ? "bg-blue-50 border-blue-200 text-blue-600"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                >
                  Internal Member
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryChange("EXTERNAL")}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    category === "EXTERNAL"
                      ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                >
                  External Council
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Assigned ID (LUSC-INT/EXT-####)[cite: 9.2]
              </label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="LUSC-INT-0001"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Hon. Member Name"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Hall Representative / Ex-Officio"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Contact (Email / Phone)
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="email@landmark.edu / +234..."
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 disabled:opacity-50 transition-all"
            >
              {loading ? "Registering..." : "Register Council Member"}
            </button>
          </form>
        </div>

        {/* Members Directory */}
        <div className="col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <h2 className="text-base font-bold text-gray-900">Council Directory</h2>
            <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
              Total: {members.length}
            </span>
          </div>

          {fetching ? (
            <p className="text-center py-8 text-xs text-gray-400">Loading members...</p>
          ) : members.length === 0 ? (
            <p className="text-center py-8 text-xs text-gray-400">No members registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-50">
                    <th className="pb-2 font-bold">ID Number</th>
                    <th className="pb-2 font-bold">Name</th>
                    <th className="pb-2 font-bold">Role</th>
                    <th className="pb-2 font-bold">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-mono font-bold text-blue-600">{m.id}</td>
                      <td className="py-2.5 font-bold text-gray-900">{m.name}</td>
                      <td className="py-2.5 text-gray-600">{m.role}</td>
                      <td className="py-2.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            m.category === "INTERNAL"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : "bg-indigo-50 text-indigo-600 border-indigo-100"
                          }`}
                        >
                          {m.category}
                        </span>
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