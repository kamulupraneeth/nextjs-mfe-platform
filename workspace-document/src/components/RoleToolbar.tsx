"use client";
import React from "react";
import { useDocStore } from "@/store/useDocStore";
import { Shield, Eye, FileEdit } from "lucide-react";

export default function RoleToolbar() {
  const { role, setRole, isSaving } = useDocStore();

  const roles = [
    {
      name: "Owner",
      icon: Shield,
      color: "text-rose-400 border-rose-500/20 bg-rose-500/10",
    },
    {
      name: "Editor",
      icon: FileEdit,
      color: "text-blue-400 border-blue-500/20 bg-blue-500/10",
    },
    {
      name: "Viewer",
      icon: Eye,
      color: "text-amber-400 border-amber-500/20 bg-amber-500/10",
    },
  ] as const;

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Active Security Context:
        </span>
        <div className="flex gap-2">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = role === r.name;
            return (
              <button
                key={r.name}
                onClick={() => setRole(r.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isActive
                    ? `${r.color} font-bold shadow-md scale-105`
                    : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300"
                }`}
              >
                <Icon size={14} />
                {r.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Saving status visual tracker sync indicators */}
      <div className="flex items-center gap-2 text-xs font-mono">
        {isSaving ? (
          <span className="flex items-center gap-1.5 text-blue-400 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Buffering modifications...
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            System states synced
          </span>
        )}
      </div>
    </div>
  );
}
