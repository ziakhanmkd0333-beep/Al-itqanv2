/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  output: 'standalone',
  distDir: 'dist',
  experimental: {
    webpackBuildWorker: true
  }
};

export default nextConfig;
