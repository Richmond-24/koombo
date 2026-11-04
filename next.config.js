
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig