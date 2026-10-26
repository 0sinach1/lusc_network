"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function VcfAdminDashboard() {
  const [activeTab, setActiveTab] = useState<"materials" | "tutors">("materials");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  
  // Form States
  const [courseCode, setCourseCode] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("PDF Note");
  const [tutorName, setTutorName] = useState("");
  const [contact, setContact] = useState("");

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    try {
      // Assumes your VCF materials API is at this endpoint
      await fetch("/api/v1/vcf/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseCode, title, link, type }),
      });
      setSuccess(`${courseCode} material added successfully!`);
      setCourseCode(""); setTitle(""); setLink("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    try {
      // Assumes your VCF tutors API is at this endpoint
      await fetch("/api/v1/vcf/tutors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseCode, name: tutorName, contact }),
      });
      setSuccess(`${tutorName} registered as tutor for ${courseCode}!`);
      setCourseCode(""); setTutorName(""); setContact("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans p-6 md:p-8 selection:bg-[#C89B59] selection:text-black">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-5 px-6 shadow-2xl">
          <div>
            <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
              <Link href="/admin" className="text-[#C89B59] font-bold hover:underline">
                ← Central Hub
              </Link>
              <span>/</span>
              <span className="text-gray-300">VCF Academic</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Academic Resources Hub
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage study materials, audiobytes, and the peer tutor directory.
            </p>
          </div>
          <span className="bg-[#124642]/40 text-emerald-300 border border-[#124642] text-xs px-3.5 py-1.5 rounded-full font-bold">
            Office Scope: /admin/vcf
          </span>
        </div>

        {success && (
          <div className="p-3.5 text-xs bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 font-bold flex justify-between items-center">
            <span>✓ {success}</span>
            <button onClick={() => setSuccess("")} className="hover:underline">✕</button>
          </div>
        )}

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Form Column */}
          <div className="md:col-span-5 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl h-fit">
            <div className="flex space-x-2 mb-6 bg-[#0D0D0D] p-1.5 rounded-2xl border border-[#6B5A21]/30">
              <button
                onClick={() => setActiveTab("materials")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === "materials" ? "bg-[#C89B59] text-black shadow-md" : "text-gray-400 hover:text-white"
                }`}
              >
                Study Materials
              </button>
              <button
                onClick={() => setActiveTab("tutors")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === "tutors" ? "bg-[#C89B59] text-black shadow-md" : "text-gray-400 hover:text-white"
                }`}
              >
                Peer Tutors
              </button>
            </div>

            {activeTab === "materials" ? (
              <form onSubmit={handleAddMaterial} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Course Code</label>
                  <input type="text" required value={courseCode} onChange={(e) => setCourseCode(e.target.value.toUpperCase())} placeholder="e.g. MAT 111" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Resource Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mid-Semester Summary Notes" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Resource Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white focus:outline-none focus:border-[#C89B59]">
                    <option value="PDF Note">PDF Note</option>
                    <option value="Audiobyte">Audiobyte</option>
                    <option value="Past Question">Past Question</option>
                    <option value="Coursify Link">Coursify Link</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">External Link (Drive/Coursify)</label>
                  <input type="url" required value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-[#C89B59] hover:bg-[#b08443] text-black font-black text-xs rounded-2xl shadow-lg transition-all mt-2">
                  {loading ? "Publishing..." : "Publish Material"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleAddTutor} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Course Code</label>
                  <input type="text" required value={courseCode} onChange={(e) => setCourseCode(e.target.value.toUpperCase())} placeholder="e.g. CSC 211" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Tutor Name</label>
                  <input type="text" required value={tutorName} onChange={(e) => setTutorName(e.target.value)} placeholder="Full Name" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Contact Link (WhatsApp/Email)</label>
                  <input type="text" required value={contact} onChange={(e) => setContact(e.target.value)} placeholder="wa.me/... or email" className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#6B5A21]/40 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89B59]" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-[#C89B59] hover:bg-[#b08443] text-black font-black text-xs rounded-2xl shadow-lg transition-all mt-2">
                  {loading ? "Registering..." : "Register Peer Tutor"}
                </button>
              </form>
            )}
          </div>

          {/* Directory Column (Placeholder for active records) */}
          <div className="md:col-span-7 bg-[#141414] border border-[#6B5A21]/40 rounded-3xl p-6 shadow-xl flex flex-col justify-center items-center text-center space-y-3 min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-[#0D0D0D] border border-[#6B5A21]/30 flex items-center justify-center text-2xl">
              {activeTab === "materials" ? "📁" : "🎓"}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live Database Sync</h3>
              <p className="text-xs text-gray-500 max-w-xs mt-1">
                Items published here instantly appear on the public <span className="text-[#C89B59]">/resources</span> student catalog.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}