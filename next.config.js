/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  allowedDevOrigins: ['127.0.0.1'],
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [45, 75, 82, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2400],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
    localPatterns: [{ pathname: '/**' }],
  },
}

module.exports = nextConfig
