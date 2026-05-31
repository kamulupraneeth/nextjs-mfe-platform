"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FileText, LayoutDashboard } from "lucide-react";

export default function GlobalNavbar() {
  const pathname = usePathname();

  const links = [
    { name: "Gateway Hub", path: "/", icon: LayoutDashboard },
    { name: "Telemetry Engine", path: "/analytics", icon: Activity },
    { name: "Secure Workspace", path: "/workspace", icon: FileText },
  ];

  return (
    <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-8 py-4 w-full">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Core Platform Logo Mark */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
            Ω
          </div>
          <span className="font-bold text-sm tracking-tight text-white hidden sm:inline">
            Enterprise Control Gate
          </span>
        </div>

        {/* Dynamic Route Links Mapping Loops */}
        <div className="flex items-center gap-1 sm:gap-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.path ||
              (link.path !== "/" && pathname.startsWith(link.path));

            {
              /* FIXED: Swapped 'Link' with semantic 'a' tag to drop client caching blocks */
            }
            return (
              <a
                key={link.path}
                href={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isActive
                    ? "bg-blue-600 border-blue-500 text-white font-bold"
                    : "bg-slate-900/40 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <Icon size={14} />
                <span>{link.name}</span>
              </a>
            );
          })}
        </div>

        {/* System Node Tracker Status Badge */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 px-2.5 py-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          MFE Cluster Active
        </div>
      </div>
    </nav>
  );
}
