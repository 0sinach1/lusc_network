"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Define mock data interfaces matching your backend
interface Material {
  id: string;
  courseCode: string;
  title: string;
  type: string;
  link: string;
}

interface Tutor {
  id: string;
  name: string;
  courseCode: string;
  contact: string;
}

export default function PublicResourcesPage() {
  const [activeTab, setActiveTab] = useState<"materials" | "tutors">("materials");
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for fetched data
  const [materials, setMaterials] = useState<Material[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch logic (Fallback to empty arrays if API is pending creation)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const matRes = await fetch("/api/v1/vcf/resources").catch(() => null);
        if (matRes?.ok) {
          const matData = await matRes.json();
          setMaterials(matData.resources || []);
        }

        const tutRes = await fetch("/api/v1/vcf/tutors").catch(() => null);
        if (tutRes?.ok) {
          const tutData = await tutRes.json();
          setTutors(tutData.tutors || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMaterials = materials.filter(m => 
    m.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTutors = tutors.filter(t => 
    t.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans selection:bg-[#C89B59] selection:text-black">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#6B5A21]/30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-[#C89B59] font-bold text-xs hover:underline">
            ← Council Portal
          </Link>
          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span className="text-emerald-400 animate-pulse">●</span> VCF Academic Hub
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        
        {/* Header & Search */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Academic <span className="text-[#C89B59]">Study Catalog</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Browse course notes, lecture audiobytes, past questions, or connect with verified peer tutors to boost your grades.
          </p>

          <div className="max-w-md mx-auto relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Course Code (e.g. GST 111)"
              className="w-full pl-11 pr-4 py-3.5 bg-[#141414] border border-[#6B5A21]/40 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C89B59] shadow-xl transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center border-b border-[#6B5A21]/30">
          <div className="flex space-x-8 text-sm font-bold">
            <button
              onClick={() => setActiveTab("materials")}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === "materials" ? "border-[#C89B59] text-[#C89B59]" : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              Study Materials
            </button>
            <button
              onClick={() => setActiveTab("tutors")}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === "tutors" ? "border-[#C89B59] text-[#C89B59]" : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              Peer Tutors
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#C89B59] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeTab === "materials" ? (
            filteredMaterials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMaterials.map((mat, idx) => (
                  <a key={idx} href={mat.link} target="_blank" rel="noopener noreferrer" className="group block bg-[#141414] border border-[#6B5A21]/30 hover:border-[#C89B59] p-5 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#C89B59]/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 bg-[#C89B59]/10 text-[#C89B59] text-[10px] font-black rounded-lg border border-[#6B5A21]/30 uppercase">
                        {mat.courseCode}
                      </span>
                      <span className="text-xs text-gray-500">{mat.type}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm group-hover:text-[#C89B59] transition-colors">{mat.title}</h3>
                    <div className="mt-4 flex items-center text-[10px] font-bold text-emerald-400">
                      <span>Access Material ➔</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-sm text-gray-500 bg-[#141414]/50 border border-[#6B5A21]/20 rounded-3xl">
                No materials found matching "{searchQuery}".
              </div>
            )
          ) : (
            filteredTutors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTutors.map((tutor, idx) => (
                  <div key={idx} className="bg-[#141414] border border-[#6B5A21]/30 p-5 rounded-2xl">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-white text-base">{tutor.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Verified Peer Tutor</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#124642]/30 border border-[#124642] flex items-center justify-center text-lg">
                        🎓
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-5">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Specialty:</span>
                      <span className="px-2 py-0.5 bg-[#C89B59]/10 text-[#C89B59] text-[10px] font-black rounded border border-[#6B5A21]/30 uppercase">
                        {tutor.courseCode}
                      </span>
                    </div>
                    <a href={tutor.contact} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-[#6B5A21]/40 text-[#C89B59] text-xs font-bold rounded-xl transition-all">
                      Contact Tutor
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-sm text-gray-500 bg-[#141414]/50 border border-[#6B5A21]/20 rounded-3xl">
                No tutors found for "{searchQuery}".
              </div>
            )
          )}
        </div>

      </main>
    </div>
  );
}