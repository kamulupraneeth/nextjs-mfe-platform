import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configures the base routing directory path for this editor sub-module
  basePath: "/workspace",
  // Prefixes code asset chunk paths to eliminate compilation collisions with the host shell
  assetPrefix: "/workspace-assets",
};

export default nextConfig;
