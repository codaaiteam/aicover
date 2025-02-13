import { Metadata } from 'next'

const supportedLocales = ['en', 'zh'] 
const baseUrl = 'https://mochi1preview.com'

export async function generateMetadata({ params: { lang = 'en' }, page = 'home' }: { params: { lang?: string }, page?: string }): Promise<Metadata> {
  // 
  const translations = await import(`@/locales/${lang}.json`)
  const currentUrl = `${baseUrl}/${lang}`
  
  // 
  const seoData = translations.seo?.[page]
  
  if (!seoData) {
    console.warn(`No SEO data found for page ${page} in language ${lang}`)
    return {
      title: translations.title || 'Mochi 1 Preview',
      description: translations.description || '',
    }
  }

  // 
  const languageAlternates = supportedLocales.reduce((acc, locale) => {
    acc[locale] = `${baseUrl}/${locale}`
    return acc
  }, {} as Record<string, string>)

  return {
    metadataBase: new URL(baseUrl),
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.ogTitle,
      description: seoData.ogDescription,
      type: 'website',
      url: currentUrl,
      images: [{ 
        url: seoData.ogImage,
        width: 1200,
        height: 630,
        alt: seoData.ogTitle
      }],
      locale: lang,
      alternateLocales: supportedLocales.filter(l => l !== lang),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.twitterTitle,
      description: seoData.twitterDescription,
      images: [seoData.twitterImage],
      creator: '@MochiAI',
      site: '@MochiAI',
    },
    alternates: {
      canonical: currentUrl,
      languages: languageAlternates,
    },
    robots: translations.robots || 'index, follow',
    authors: [{ name: "Genmo AI" }],
    applicationName: "Mochi 1 Preview",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    verification: {
      google: translations.googleSiteVerification || "O_PEb7XrNO2XGoETepMtJp-a4LSDyuO2xi3N4H5zOu0",
    },
  }
}
