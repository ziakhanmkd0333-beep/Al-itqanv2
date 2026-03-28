/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  output: 'standalone',
  distDir: '.next'
};

export default nextConfig;
