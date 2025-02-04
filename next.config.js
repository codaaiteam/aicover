// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 添加静态页面配置
  output: 'standalone',
  // 优化构建
  swcMinify: true,
  // 配置动态路由
  experimental: {
    serverActions: true,
  },
  // 配置图片域名
  images: {
    domains: ['pub-3626123a908346a7a8be8d9295f3120a.r2.dev'],
  },
  // 禁用 Next.js 的严格模式
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig