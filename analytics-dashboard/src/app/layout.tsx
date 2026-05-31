import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Telemetry Engine Node",
  description: "Isolated Micro-Frontend Stream Core",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-slate-950">
      <body className="antialiased bg-slate-950 min-h-screen text-slate-100">
        {/* Renders the sub-module page grids transparently inside the host gateway frame */}
        {children}
      </body>
    </html>
  );
}
