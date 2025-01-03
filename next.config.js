/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx']
}

module.exports = nextConfig