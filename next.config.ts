import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: 'dist',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  experimental: {
    workerThreads: false,
    cpus: 1
  }
};

export default nextConfig;
