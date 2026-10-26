import Link from "next/link";

export default function AdminHubPage() {
  const offices = [
    {
      title: "Super Admin Hub",
      desc: "Manage admin accounts, certificate engine, and council member registry.",
      href: "/admin/super",
      badge: "Global Governance",
      icon: "👑",
    },
    {
      title: "Vice Chairman (VCM)",
      desc: "Student certifications, hall representative directories, and public verification.",
      href: "/admin/vcm",
      badge: "Certifications",
      icon: "📜",
    },
    {
      title: "Welfare Office",
      desc: "Financial support applications, gate deliveries, emergency pickups, and donations.",
      href: "/admin/welfare",
      badge: "Aid & Delivery",
      icon: "🤝",
    },
    {
      title: "Public Relations (PRO)",
      desc: "Lost & found inventory registry and item claiming tracking system.",
      href: "/admin/pro",
      badge: "Lost & Found",
      icon: "📢",
    },
    {
      title: "General Secretary",
      desc: "Official memos, senate sitting minutes, and signed document archives.",
      href: "/admin/gensec",
      badge: "Document Archive",
      icon: "📁",
    },
    {
      title: "Chairman & Squad",
      desc: "Executive oversight, student disciplinary bookings, and directives.",
      href: "/admin/chairman",
      badge: "Executive Squad",
      icon: "⚖️",
    },
    {
      title: "Vice Chairman Financials (VCF)",
      desc: "Academic course notes, educational tools, audiobytes, and peer tutor directory.",
      href: "/admin/vcf",
      badge: "Academic Resources",
      icon: "📚",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 font-sans p-6 md:p-12 selection:bg-[#C89B59] selection:text-black">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#6B5A21]/30 pb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C89B59] via-[#6B5A21] to-[#124642] p-0.5 flex items-center justify-center shadow-lg shadow-[#C89B59]/10">
                <div className="w-full h-full bg-[#0D0D0D] rounded-[14px] flex items-center justify-center">
                  <span className="text-[#C89B59] font-black text-lg">⚖️</span>
                </div>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[#C89B59] bg-[#6B5A21]/20 px-3 py-1 rounded-full border border-[#6B5A21]/40">
                Landmark University Student Council
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              LUSC Central Admin Hub
            </h1>
            <p className="text-xs md:text-sm text-gray-400 max-w-2xl">
              Select an administrative office dashboard below to manage platform operations and access module registries.
            </p>
          </div>

          {/* System Operational Badge */}
          <div className="flex items-center space-x-3 self-start md:self-auto">
            <div className="px-4 py-2 rounded-2xl bg-[#124642]/30 border border-[#124642] text-emerald-300 text-xs font-bold flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>System Operational</span>
            </div>
          </div>
        </div>

        {/* Office Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offices.map((office) => (
            <Link
              key={office.href}
              href={office.href}
              className="group relative overflow-hidden rounded-3xl bg-[#141414] border border-[#6B5A21]/30 hover:border-[#C89B59] p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-[#C89B59]/10 hover:-translate-y-1 flex flex-col justify-between space-y-6"
            >
              {/* Subtle Emerald Background Radial Glow */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#124642]/20 rounded-full blur-xl group-hover:bg-[#C89B59]/20 transition-all duration-300"></div>

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-2xl p-2.5 rounded-2xl bg-[#0D0D0D] border border-[#6B5A21]/30 text-white shadow-inner">
                    {office.icon}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#124642]/40 text-[#C89B59] border border-[#124642]">
                    {office.badge}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white group-hover:text-[#C89B59] transition-colors">
                  {office.title}
                </h2>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {office.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#6B5A21]/20 flex items-center justify-between text-xs font-bold text-[#C89B59] group-hover:text-white transition-colors relative z-10">
                <span>Access Portal</span>
                <span className="transform group-hover:translate-x-1 transition-transform">➔</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Security & Access Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#124642]/30 via-[#141414] to-[#0D0D0D] border border-[#124642]/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🛡️</span>
            <div>
              <p className="font-bold text-white">Role-Based Access Control Active</p>
              <p className="text-gray-400 text-[11px]">Routes protected by Edge Middleware and signed JWT session tokens.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#C89B59] bg-[#6B5A21]/20 px-3 py-1.5 rounded-xl border border-[#6B5A21]/40">
            LUSC-PLATFORM-V2.6
          </span>
        </div>

      </div>
    </div>
  );
}