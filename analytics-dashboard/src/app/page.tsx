"use client";
import React, { useState, useEffect } from "react";
import RealTimeChart from "@/components/RealTimeChart";
import VirtualizedTable from "@/components/VirtualizedTable";

type Metric = {
  id: string;
  statusCode: number;
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  networkIn: number;
  [key: string]: unknown;
};

export default function AnalyticsDashboardPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    // Open a persistent connection directly to our SSE stream route
    // const eventSource = new EventSource("/analytics/api/metrics");
    const eventSource = new EventSource(
      "http://localhost:3000/analytics/api/metrics",
    );

    eventSource.onmessage = (event) => {
      const incomingData = JSON.parse(event.data) as Metric;
      setMetrics((prev) => {
        const updated = [...prev, incomingData];
        // Keeps the chart view clear by holding only the last 30 data logs
        return updated.slice(-30);
      });
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-slate-900 pb-5">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Project 1: Live Analytics System
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Running independently on port 3001 | Proxied dynamically via main
            Host Route Matrix
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {/* Injecting the rendering layer */}
          <RealTimeChart data={metrics} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Injecting the rendering layer */}
          <VirtualizedTable logs={metrics} />
        </div>
      </div>
    </div>
  );
}
