"use client";
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ChartProps {
  data: Array<{
    timestamp: string;
    cpuUsage: number;
    memoryUsage: number;
    networkIn: number;
  }>;
}

export default function RealTimeChart({ data }: ChartProps) {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-xl">
      <h3 className="text-white font-semibold text-lg mb-4">
        Core Engine Performance (Micro-Frontend 3001)
      </h3>
      <div className="h-75 w-full min-h-75 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} />
            <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="cpuUsage"
              name="CPU Core %"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.06}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="memoryUsage"
              name="Memory RAM %"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.06}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
