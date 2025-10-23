/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // Optimize images (not needed for this app)
  images: {
    unoptimized: true
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['browser-image-compression']
  }
}

module.exports = nextConfig