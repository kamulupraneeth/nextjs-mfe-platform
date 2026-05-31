import type { NextConfig } from "next";

const ANALYTICS_URL =
  process.env.PRODUCTION_ANALYTICS_URL || "http://localhost:3001";
const WORKSPACE_URL =
  process.env.PRODUCTION_WORKSPACE_URL || "http://localhost:3002";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return {
      beforeFiles: [
        // --- PROJECT 1: ANALYTICS MODULE REWRITES ---
        {
          // Forwards the base path query straight across to local server port 3001
          source: "/analytics",
          destination: `${ANALYTICS_URL}/analytics`,
        },
        {
          // FORCE-MATCH THE API ROUTE CROSS-PROXY
          source: "/analytics/api/metrics",
          destination: `${ANALYTICS_URL}/analytics/api/metrics`,
        },
        {
          // Handles nested sub-pages inside Analytics Dashboard
          source: "/analytics/:path",
          destination: `${ANALYTICS_URL}/analytics/:path`,
        },
        {
          // Routes the static JS payload file bundles without asset clipping
          source: "/analytics-assets/_next/:path*",
          destination: `${ANALYTICS_URL}/analytics-assets/_next/:path*`,
        },
        // --- PROJECT 2: DOCUMENT SECURE EDITOR WORKSPACE REWRITES ---
        {
          source: "/workspace",
          destination: `${WORKSPACE_URL}/workspace`,
        },
        {
          source: "/workspace/:path*",
          destination: `${WORKSPACE_URL}/workspace/:path*`,
        },
        {
          source: "/workspace-assets/_next/:path*",
          destination: `${WORKSPACE_URL}/workspace-assets/_next/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
