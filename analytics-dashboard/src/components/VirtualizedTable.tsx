"use client";
import React, { useMemo, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

interface MetricLog {
  id: string;
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  statusCode: number;
}

interface TableProps {
  logs: MetricLog[];
}

const columnHelper = createColumnHelper<MetricLog>();

export default function VirtualizedTable({ logs }: TableProps) {
  // 1. Column configuration setups (Memoized for high-speed loops)
  const columns = useMemo(
    () => [
      columnHelper.accessor("timestamp", {
        header: "Timestamp",
        cell: (info) => (
          <span className="font-mono text-slate-400">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("id", {
        header: "Packet ID",
        cell: (info) => (
          <span className="font-mono text-blue-400">#{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("cpuUsage", {
        header: "CPU Metric",
        cell: (info) => (
          <span
            className={
              info.getValue() > 70
                ? "text-rose-400 font-medium"
                : "text-slate-200"
            }
          >
            {info.getValue()} %
          </span>
        ),
      }),
      columnHelper.accessor("memoryUsage", {
        header: "RAM Metric",
        cell: (info) => (
          <span className="text-slate-200">{info.getValue()} %</span>
        ),
      }),
      columnHelper.accessor("statusCode", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          return (
            <span
              className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                status === 200
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              {status}
            </span>
          );
        },
      }),
    ],
    [],
  );

  // 2. Initialize Core TanStack Engine
  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  // 3. CORE VIRTUALIZATION ENGINE LOGIC
  // A scrollable container reference is required to track offsets
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 45, // Target uniform height for every table row in pixels
    overscan: 5, // Number of extra buffer rows to pre-render outside viewport bounds
  });

  const { getVirtualItems, getTotalSize } = rowVirtualizer;

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-xl mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">
          System Telemetry Logs (Virtualized)
        </h3>
        <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">
          Total Packets Stored: {logs.length} | Rendering in DOM:{" "}
          {getVirtualItems().length}
        </span>
      </div>

      {/* Outer Viewport Box mapping scroll offsets */}
      <div
        ref={tableContainerRef}
        className="h-[400px] overflow-y-auto border border-slate-800 rounded-lg bg-slate-950 relative scrollbar-thin"
      >
        {/* Inner bounding box generating absolute height canvas structure */}
        <div
          style={{
            height: `${getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          <table className="w-full text-left border-collapse text-sm absolute top-0 left-0">
            <thead className="sticky top-0 bg-slate-900 text-slate-400 font-medium border-b border-slate-800 z-20">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-3 text-xs font-semibold tracking-wider uppercase"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {/* Only slice and map through active visible dynamic indices */}
              {getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className="hover:bg-slate-900/40 transition-colors absolute w-full left-0 flex"
                    style={{
                      transform: `translateY(${virtualRow.start}px)`, // Manually translate position inside canvas
                      height: `${virtualRow.size}px`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="p-3 border-b border-slate-900/60 text-slate-300 flex-1 flex items-center"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
