/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // Optimize images (not needed for this app)
  images: {
    unoptimized: true
  },

  // Headers for camera permission persistence on mobile
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=()'
          },
          {
            key: 'Feature-Policy',
            value: 'camera \'self\'; microphone \'none\''
          }
        ],
      },
    ]
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['browser-image-compression']
  }
}

module.exports = nextConfig