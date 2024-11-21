/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prodigy-commerce-production.s3.*.amazonaws.com',
        pathname: '/store/**',
        port: ''
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/uploads/**'
      }
    ]
  },
  experimental: { instrumentationHook: true }
};
