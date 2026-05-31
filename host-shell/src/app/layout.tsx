import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalNavbar from "@/components/GlobalNavbar"; // Import the navbar module

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enterprise MFE Platform Shell",
  description: "Distributed Multi-Zone Orchestrator Container",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-slate-950">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-950`}
      >
        {/* NEW INJECTION: Shared navbar renders at the absolute top layout header position */}
        <GlobalNavbar />

        {/* The child page frames render cleanly below */}
        <div className="flex-grow">{children}</div>
      </body>
    </html>
  );
}
