import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mochi1preview.com'
const languages = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it']

type RouteConfig = {
  path: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

const routes: RouteConfig[] = [
  { path: '', changeFrequency: 'daily', priority: 1 },
  { path: '/create', changeFrequency: 'daily', priority: 0.8 },
  { path: '/guide', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/price', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/videos', changeFrequency: 'daily', priority: 0.7 },
  { path: '/terms', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/privacy', changeFrequency: 'monthly', priority: 0.5 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapRoutes: MetadataRoute.Sitemap = []

  // 添加所有路由的所有语言版本
  languages.forEach(lang => {
    routes.forEach(route => {
      const langPrefix = lang === 'en' ? '' : `/${lang}`
      sitemapRoutes.push({
        url: `${baseUrl}${langPrefix}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: lang === 'en' ? route.priority : route.priority * 0.9, // 非英语版本优先级略低
      })
    })
  })

  return sitemapRoutes
}
