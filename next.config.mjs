/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  output: 'export',
  distDir: 'dist',
  assetPrefix: '.',
  generateBuildId: () => 'build'
};

export default nextConfig;
