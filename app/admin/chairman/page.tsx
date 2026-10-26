"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, getSessionRole } from "@/app/actions/auth"; // Imported both actions

interface DisciplinaryRecord {
  id: string;
  studentName: string;
  regNo: string;
  offense: string;
  date: string;
}

interface ExecutiveDirective {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function ChairmanDashboardPage() {
  const router = useRouter();

  // Initialize as null to prevent UI flashing before the role is confirmed
  const [userRole, setUserRole] = useState<string | null>(null); 

  const [activeTab, setActiveTab] = useState<"disciplinary" | "directives">("disciplinary");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Disciplinary Form State
  const [studentName, setStudentName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [offense, setOffense] = useState("");
  const [records, setRecords] = useState<DisciplinaryRecord[]>([]);

  // Directives Form State
  const [directiveTitle, setDirectiveTitle] = useState("");
  const [directiveContent, setDirectiveContent] = useState("");
  const [directives, setDirectives] = useState<ExecutiveDirective[]>([]);

  // Fetch the actual role from the JWT on mount
  useEffect(() => {
    const fetchRole = async () => {
      const role = await getSessionRole();
      setUserRole(role || "chairman"); // Force a valid string fallback
    };
    fetchRole();
    
    // Example: fetch('/api/v1/chairman/records')...
  }, []);

  const handleLogout = async () => {
    // 1. Call the server action to destroy the JWT cookie
    await logout(); 
    
    // 2. Redirect back to the login screen
    router.push("/admin/login");
  };
  
  const handleLogBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      // Replace with your actual API endpoint
      // await fetch('/api/v1/chairman/records', { method: 'POST', body: JSON.stringify({ studentName, regNo, offense }) });
      
      // Temporary optimistic UI update for demonstration
      setRecords((prev) => [
        { id: Math.random().toString(), studentName, regNo, offense, date: new Date().toISOString() },
        ...prev,
      ]);
      setSuccess(`Disciplinary record logged for ${studentName}.`);
      setStudentName("");
      setRegNo("");
      setOffense("");
    } catch (err) {
      setError("Failed to log disciplinary booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleIssueDirective = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      // Replace with your actual API endpoint
      // await fetch('/api/v1/chairman/directives', { method: 'POST', body: JSON.stringify({ title: directiveTitle, content: directiveContent }) });
      
      setDirectives((prev) => [
        { id: Math.random().toString(), title: directiveTitle, content: directiveContent, date: new Date().toISOString() },
        ...prev,
      ]);
      setSuccess(`Executive directive "${directiveTitle}" issued globally.`);
      setDirectiveTitle("");
      setDirectiveContent("");
    } catch (err) {
      setError("Failed to issue executive directive.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans p-6 md:p-8 selection:bg-[#C89B59] selection:text-black">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-5 px-6 shadow-2xl">
          <div>
            <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
              
              {/* Bulletproof Conditional Rendering based on Fetched Role */}
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
              <span className="text-gray-300">Executive Oversight</span>
            </div>
            
            <h1 className="text-2xl font-black text-white tracking-tight">
              Chairman & Revolutionary Squad
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Disciplinary tracking & executive oversight directives.
            </p>
          </div>

          <span className="bg-[#124642]/40 text-emerald-300 border border-[#124642] text-xs px-3.5 py-1.5 rounded-full font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Office Scope: /admin/chairman
          </span>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3.5 text-xs bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 font-medium">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="p-3.5 text-xs bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 font-bold flex justify-between items-center">
            <span>✓ {success}</span>
            <button onClick={() => setSuccess("")} className="hover:underline">✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-[#141414] p-1.5 rounded-2xl border border-[#6B5A21]/30 max-w-md">
          <button
            onClick={() => setActiveTab("disciplinary")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "disciplinary" ? "bg-[#C89B59] text-black shadow-md" : "text-gray-400 hover:text-white hover:bg-[#0D0D0D]"
            }`}
          >
            Disciplinary Records ({records.length})
          </button>
          <button
            onClick={() => setActiveTab("directives")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "directives" ? "bg-[#C89B59] text-black shadow-md" : "text-gray-400 hover:text-white hover:bg-[#0D0D0D]"
            }`}
          >
            Executive Directives ({directives.length})
          </button>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Form Column */}
          <div className="md:col-span-5 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl h-fit space-y-4">
            <div className="border-b border-[#6B5A21]/30 pb-3">
              <h2 className="text-base font-bold text-white">
                {activeTab === "disciplinary" ? "Book Disciplinary Case" : "Issue Executive Directive"}
              </h2>
              <p className="text-[11px] text-gray-400">
                {activeTab === "disciplinary" 
                  ? "Log rule breaches and council disciplinary actions." 
                  : "Publish official mandates to the student body."}
              </p>
            </div>

            {activeTab === "disciplinary" ? (
              <form onSubmit={handleLogBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Student Name</label>
                  <input type="text" required value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Full Student Name" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Registration No / Matric</label>
                  <input type="text" required value={regNo} onChange={(e) => setRegNo(e.target.value)} placeholder="e.g. 210..." className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Offense Details</label>
                  <textarea rows={4} required value={offense} onChange={(e) => setOffense(e.target.value)} placeholder="Describe breach of university/council rules..." className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59] transition-all" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-[#C89B59] hover:bg-[#b08443] text-black font-black text-xs rounded-2xl shadow-lg shadow-[#C89B59]/20 transition-all mt-2">
                  {loading ? "Logging Booking..." : "Log Disciplinary Booking"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleIssueDirective} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Directive Title</label>
                  <input type="text" required value={directiveTitle} onChange={(e) => setDirectiveTitle(e.target.value)} placeholder="e.g. Mandatory Dress Code Enforcement" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Mandate Content</label>
                  <textarea rows={6} required value={directiveContent} onChange={(e) => setDirectiveContent(e.target.value)} placeholder="Detail the specific rules, timelines, and consequences..." className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59] transition-all" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-[#C89B59] hover:bg-[#b08443] text-black font-black text-xs rounded-2xl shadow-lg shadow-[#C89B59]/20 transition-all mt-2">
                  {loading ? "Publishing..." : "Issue Executive Directive"}
                </button>
              </form>
            )}
          </div>

          {/* Registry Column */}
          <div className="md:col-span-7 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl space-y-4 h-fit min-h-[400px]">
            <div className="flex items-center justify-between border-b border-[#6B5A21]/30 pb-3">
              <h2 className="text-base font-bold text-white">
                {activeTab === "disciplinary" ? "Disciplinary Registry" : "Active Directives"}
              </h2>
              <span className="text-[10px] font-bold bg-[#C89B59]/10 text-[#C89B59] border border-[#6B5A21]/30 px-3 py-1 rounded-full">
                Count: {activeTab === "disciplinary" ? records.length : directives.length}
              </span>
            </div>

            {activeTab === "disciplinary" ? (
              records.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-50">
                  <span className="text-4xl">⚖️</span>
                  <p className="text-xs text-gray-400">No disciplinary bookings logged.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {records.map((record) => (
                    <div key={record.id} className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#6B5A21]/30 hover:border-red-500/30 transition-all space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
                      <div className="flex justify-between items-start pl-2">
                        <div>
                          <p className="font-bold text-white text-sm">{record.studentName}</p>
                          <p className="text-[10px] text-[#C89B59] font-mono">{record.regNo}</p>
                        </div>
                        <p className="text-[10px] text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                      <p className="text-xs text-gray-400 pl-2 leading-relaxed">{record.offense}</p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              directives.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-50">
                  <span className="text-4xl">📜</span>
                  <p className="text-xs text-gray-400">No executive directives issued.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {directives.map((directive) => (
                    <div key={directive.id} className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#6B5A21]/30 hover:border-[#C89B59]/50 transition-all space-y-2">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-white text-sm">{directive.title}</p>
                        <p className="text-[10px] text-gray-500 shrink-0">{new Date(directive.date).toLocaleDateString()}</p>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">{directive.content}</p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}