"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface WelfareApplication {
  id: string;
  reference: string;
  studentName: string;
  regNo: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function WelfareApplicationsPage() {
  const [applications, setApplications] = useState<WelfareApplication[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/v1/welfare/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error("Failed to load applications", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/welfare" className="text-xs font-bold text-blue-600 hover:underline">
            ← Back to Welfare Hub
          </Link>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Fund & Support Applications</h1>
          <p className="text-xs text-gray-500">Review and manage student welfare requests.</p>
        </div>
        <span className="bg-blue-50 text-blue-600 text-[10px] px-3 py-1.5 rounded-full font-bold border border-blue-100">
          Route: /api/v1/welfare/applications
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {fetching ? (
          <p className="text-center py-8 text-xs text-gray-400">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="text-center py-8 text-xs text-gray-400">No applications received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-50">
                  <th className="pb-2 font-bold">Ref Code</th>
                  <th className="pb-2 font-bold">Student</th>
                  <th className="pb-2 font-bold">Reg No</th>
                  <th className="pb-2 font-bold">Type</th>
                  <th className="pb-2 font-bold">Status</th>
                  <th className="pb-2 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-mono font-bold text-blue-600">{app.reference}</td>
                    <td className="py-3 font-bold text-gray-900">{app.studentName}</td>
                    <td className="py-3 text-gray-600">{app.regNo}</td>
                    <td className="py-3 text-gray-600">{app.type}</td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        app.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
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