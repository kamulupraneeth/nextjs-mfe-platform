"use client";
import React, { useState, useEffect, useRef } from "react";
import RealTimeChart from "@/components/RealTimeChart";
import VirtualizedTable from "@/components/VirtualizedTable";

type LogEntry = {
  id: string;
  statusCode: number;
  cpuUsage: number;
  timestamp: string;
  memoryUsage: number;
  networkIn: number;
  [key: string]: unknown;
};

export default function AnalyticsDashboardPage() {
  const [chartMetrics, setChartMetrics] = useState<LogEntry[]>([]);
  const [tableLogs, setTableLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const workerRef = useRef<Worker | null>(null);

  // 1. INLINE WORKER ENGINE PARSING SYSTEM
  useEffect(() => {
    // We write the worker code inside a string block
    const workerCode = `
      self.onmessage = function (e) {
        const { logs, searchTerm } = e.data;
        if (!searchTerm || searchTerm.trim() === '') {
          self.postMessage(logs);
          return;
        }
        const cleanTerm = searchTerm.toLowerCase().trim();
        const filtered = logs.filter((log) => {
          return (
            log.id.toLowerCase().includes(cleanTerm) ||
            log.statusCode.toString().includes(cleanTerm) ||
            log.cpuUsage.toString().includes(cleanTerm)
          );
        });
        self.postMessage(filtered);
      };
    `;

    // Convert the string into an executable data blob matrix
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);

    // Instantiate the worker straight from memory (0% risk of asset 404 errors!)
    workerRef.current = new Worker(workerUrl);

    workerRef.current.onmessage = (e: MessageEvent) => {
      setFilteredLogs(e.data);
    };

    workerRef.current.onerror = (err) => {
      console.error("Inline Web Worker internal thread error:", err);
    };

    return () => {
      workerRef.current?.terminate();
      URL.revokeObjectURL(workerUrl); // Free system memory
    };
  }, []);

  // 2. Core Server-Sent Events (SSE) Stream Integration
  useEffect(() => {
    const eventSource = new EventSource("/analytics/api/metrics");

    eventSource.onmessage = (event) => {
      const incomingData = JSON.parse(event.data);
      const localFormattedTime = new Date(
        incomingData.timestamp,
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const adjustedPacket = {
        ...incomingData,
        timestamp: localFormattedTime,
      };
      setChartMetrics((prev) => [...prev, adjustedPacket].slice(-30));
      setTableLogs((prev) => [adjustedPacket, ...prev].slice(0, 500));
    };

    eventSource.onerror = (err) => {
      console.error("SSE stream pipeline lost connection:", err);
    };

    return () => eventSource.close();
  }, []);

  // 3. Keep the inline background worker thread in sync
  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ logs: tableLogs, searchTerm });
    }
  }, [tableLogs, searchTerm]);

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

        {/* Real-time Search Input Component Layout */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search logs by Packet ID, Status Code (e.g. 500), or metrics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-lg text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <RealTimeChart data={chartMetrics} />
          <VirtualizedTable logs={filteredLogs} />
        </div>
      </div>
    </div>
  );
}
