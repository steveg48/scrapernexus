/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  experimental: {
    serverActions: true,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ],
      },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Handle static file requests
        {
          source: '/_next/static/:path*',
          destination: '/_next/static/:path*',
        },
        {
          source: '/static/:path*',
          destination: '/static/:path*',
        },
      ],
      afterFiles: [
        // Handle API routes
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
      fallback: [
        // Handle all other routes
        {
          source: '/:path*',
          destination: '/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig