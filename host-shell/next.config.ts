import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return {
      beforeFiles: [
        // --- PROJECT 1: ANALYTICS MODULE REWRITES ---
        {
          // Forwards the base path query straight across to local server port 3001
          source: "/analytics",
          destination: "http://localhost:3001/analytics",
        },
        {
          // FORCE-MATCH THE API ROUTE CROSS-PROXY
          source: "/analytics/api/metrics",
          destination: "http://localhost:3001/analytics/api/metrics",
        },
        {
          // Handles nested sub-pages inside Analytics Dashboard
          source: "/analytics/:path",
          destination: "http://localhost:3001/analytics/:path",
        },
        {
          // Routes the static JS payload file bundles without asset clipping
          source: "/analytics-assets/_next/:path*",
          destination: "http://localhost:3001/analytics-assets/_next/:path*",
        },
        // --- PROJECT 2: DOCUMENT SECURE EDITOR WORKSPACE REWRITES ---
        {
          source: "/workspace",
          destination: "http://localhost:3002/workspace",
        },
        {
          source: "/workspace/:path*",
          destination: "http://localhost:3002/workspace/:path*",
        },
        {
          source: "/workspace-assets/_next/:path*",
          destination: "http://localhost:3002/workspace-assets/_next/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
