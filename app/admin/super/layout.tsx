"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Suppress sidebar on login screen
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#0D0D0D]">{children}</div>;
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/v1/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    { name: "Central Hub", href: "/admin", icon: "🏛️" },
    { name: "Super Admin", href: "/admin/super", icon: "👑" },
    { name: "Accounts", href: "/admin/super/accounts", icon: "🔑" },
    { name: "Welfare Office", href: "/admin/welfare", icon: "🤝" },
    { name: "PRO Lost & Found", href: "/admin/pro", icon: "📢" },
    { name: "General Secretary", href: "/admin/gensec", icon: "📁" },
    { name: "Chairman & Squad", href: "/admin/chairman", icon: "⚖️" },
    { name: "VCF Academic", href: "/admin/vcf", icon: "📚" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-gray-100 font-sans selection:bg-[#C89B59] selection:text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141414] border-r border-[#6B5A21]/40 flex flex-col justify-between p-5 shrink-0 min-h-screen">
        <div className="space-y-6">
          {/* Brand Crest */}
          <div className="flex items-center space-x-3 px-2 pt-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C89B59] via-[#6B5A21] to-[#124642] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#0D0D0D] rounded-[14px] flex items-center justify-center">
                <span className="text-[#C89B59] font-black text-base">⚖️</span>
              </div>
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-wider">
                LUSC <span className="text-[#C89B59]">HQ</span>
              </h1>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Admin Platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#C89B59] text-black shadow-lg font-black"
                      : "text-gray-400 hover:text-white hover:bg-[#124642]/30"
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile & Logout */}
        <div className="pt-4 border-t border-[#6B5A21]/30 space-y-2">
          <div className="p-3 rounded-2xl bg-[#0D0D0D] border border-[#6B5A21]/40 text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#C89B59]/20 border border-[#C89B59]/40 text-[#C89B59] font-black flex items-center justify-center text-[10px]">
                SA
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-[#C89B59] leading-tight">Super Admin</p>
                <p className="text-[9px] text-gray-500 leading-tight">Full Privileges</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-all disabled:opacity-50"
          >
            <span>🚪</span>
            <span>{loggingOut ? "Signing Out..." : "Log Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}