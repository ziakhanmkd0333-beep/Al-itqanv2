import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  experimental: {
    // Exclude API routes from static generation
    workerThreads: false,
    cpus: 1
  }
};

export default nextConfig;
