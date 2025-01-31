/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'pub-de18dc3c90824394abf06cb24b33028d.r2.dev',
      'your-cdn-domain.com'
    ],
  },
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['@ffmpeg/core']  // Add any external packages that might cause SSR issues
  }
}

module.exports = nextConfig
