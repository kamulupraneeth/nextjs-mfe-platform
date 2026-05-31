"use client";
import React from "react";
import Link from "next/link";

export default function HostLandingHub() {
  const platforms = [
    {
      title: "Project 1: System Telemetry Engine",
      description:
        "Distributed telemetry grid parsing live SSE packet streams at 200ms intervals with dedicated multi-threaded worker rendering optimization configurations.",
      path: "/analytics",
      badge: "Active Module",
      tech: ["Next.js 16", "TanStack", "Recharts", "Web Workers"],
    },
    {
      title: "Project 2: Enterprise Workspace",
      description:
        "Granular role-based document authorization system featuring low-latency rich-text canvas buffers and custom authentication middleware tracking rules.",
      path: "/workspace",
      badge: "Active Module",
      tech: ["Tiptap", "Zustand", "Next-Auth", "IndexedDB"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Hero Header Presentation Space */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-8 py-16">
        <section className="mb-16 max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4 sm:text-5xl leading-tight">
            Distributed Next.js 16 Platform Ecosystem
          </h1>
          <p className="text-md text-slate-400 leading-relaxed">
            Orchestrating isolated sub-application workspaces using native proxy
            routing parameters. Open isolated branches to interact with distinct
            telemetry zones cleanly.
          </p>
        </section>

        {/* Dynamic Platforms Map Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((app, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2 py-0.5 rounded font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {app.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {app.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {app.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {app.tech.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-950 px-2.5 py-1 rounded-md text-slate-400 border border-slate-900 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Dynamically renders blue anchor paths for both active MFE modules */}
                <Link
                  href={app.path}
                  className="inline-flex w-full items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/10"
                >
                  Launch Module Workspace →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Global Bottom System Footer */}
      <footer className="border-t border-slate-900 py-6 px-8 text-center text-xs text-slate-600 font-mono">
        Host Node Cluster Execution Environment | Port: 3000
      </footer>
    </div>
  );
}
