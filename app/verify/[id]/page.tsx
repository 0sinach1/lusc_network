"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface CertificateData {
  id: string;
  recipientName: string;
  regNo: string;
  title: string;
  office: string;
  status: string;
  issueDate: string;
}

export default function CertificateVerificationPage() {
  const params = useParams();
  const certificateId = params?.id as string;

  const [data, setData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!certificateId) return;

    const verifyRecord = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/certificates/verify/${certificateId}`);

        if (res.ok) {
          const result = await res.json();
          setData(result.certificate);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to verify record:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    verifyRecord();
  }, [certificateId]);

  const isValidStatus = (status: string) => {
    const s = status.toLowerCase();
    return s === "valid" || s === "active" || s === "issued" || s === "verified";
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans flex items-center justify-center p-4 md:p-8 selection:bg-[#C89B59] selection:text-black">
      <div className="w-full max-w-2xl bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden space-y-8">
        
        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-[#124642]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header Branding */}
        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C89B59] via-[#6B5A21] to-[#124642] p-0.5 mx-auto flex items-center justify-center shadow-lg shadow-[#C89B59]/20">
            <div className="w-full h-full bg-[#0D0D0D] rounded-[14px] flex items-center justify-center">
              <span className="text-[#C89B59] font-black text-2xl">⚖️</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
              Landmark University Student Council
            </h1>
            <p className="text-xs text-[#C89B59] font-semibold tracking-wider uppercase mt-0.5">
              Official Credential Verification Registry
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#C89B59] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-400 font-mono">
              Interrogating cryptographic ledger...
            </p>
          </div>
        ) : notFound || !data ? (
          <div className="p-6 md:p-8 bg-[#0D0D0D] border border-red-500/30 rounded-2xl text-center space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto text-xl font-black">
              ✕
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Record Not Found or Invalid</h2>
              <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                No active certificate matching token{" "}
                <span className="font-mono text-red-400 break-all">{certificateId}</span> could be located in the council repository.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#6B5A21]/40 text-xs font-bold text-[#C89B59] transition-all"
            >
              ← Return to Main Portal
            </Link>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {/* Status Indicator */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0D0D0D] border border-[#6B5A21]/40">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Ledger Status
                </p>
                <p className="text-sm font-black text-white mt-0.5">
                  {data.status} RECORD
                </p>
              </div>

              {isValidStatus(data.status) ? (
                <span className="px-3.5 py-1.5 rounded-full bg-[#124642]/50 text-emerald-300 border border-[#124642] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#124642]/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Authentic & Verified
                </span>
              ) : (
                <span className="px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold flex items-center gap-1.5">
                  Revoked
                </span>
              )}
            </div>

            {/* Certificate Details */}
            <div className="bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl p-5 md:p-6 space-y-5">
              <div className="border-b border-[#6B5A21]/20 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C89B59]">
                  Certificate Title / Honor
                </span>
                <p className="text-lg md:text-xl font-black text-white mt-1">
                  {data.title}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Recipient Name
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {data.recipientName}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Matric / Reg Number
                  </span>
                  <p className="text-sm font-mono font-bold text-[#C89B59] mt-0.5">
                    {data.regNo}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Issuing Authority
                  </span>
                  <p className="text-xs font-semibold text-gray-300 mt-0.5">
                    {data.office}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Issue Date
                  </span>
                  <p className="text-xs font-semibold text-gray-300 mt-0.5">
                    {new Date(data.issueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Cryptographic ID Token */}
              <div className="pt-4 border-t border-[#6B5A21]/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Cryptographic Serial Reference
                </span>
                <p className="font-mono text-xs text-[#C89B59] bg-[#141414] border border-[#6B5A21]/30 p-2.5 rounded-xl break-all">
                  {data.id}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500 pt-2">
              <p>Issued under Landmark University Student Council Charter.</p>
              <Link href="/admin" className="text-[#C89B59] font-bold hover:underline">
                Council Portal ➔
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}