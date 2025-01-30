import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mochi1preview.com'
const languages = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it']

export default function sitemap(): MetadataRoute.Sitemap {
  // 基础路由
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ] as MetadataRoute.Sitemap

  // 为每种语言添加路由
  languages.forEach(lang => {
    if (lang === 'en') return // 英语已经包含在基础路由中

    routes.push(
      {
        url: `${baseUrl}/${lang}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/${lang}/create`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${lang}/guide`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
    )
  })

  return routes
}
