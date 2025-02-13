import { Metadata } from 'next'

const supportedLocales = ['en', 'zh'] 
const baseUrl = 'https://mochi1preview.com'

export async function generateMetadata({ params: { lang = 'en' }, page = 'home' }: { params: { lang?: string }, page?: string }): Promise<Metadata> {
  // Load translations
  const translations = await import(`@/locales/${lang}.json`)
  
  // Generate URLs
  const pagePath = page === 'home' ? '' : `/${page}`
  const currentUrl = `${baseUrl}/${lang}${pagePath}`
  
  // Get SEO data for current page
  const seoData = translations.seo?.[page]
  
  if (!seoData) {
    console.warn(`No SEO data found for page ${page} in language ${lang}`)
    return {
      title: translations.title || 'Mochi 1 Preview',
      description: translations.description || '',
      alternates: {
        canonical: currentUrl
      }
    }
  }

  // Generate language alternates for SEO
  const languageAlternates = supportedLocales.reduce((acc, locale) => {
    acc[locale] = `${baseUrl}/${locale}${pagePath}`
    return acc
  }, {} as Record<string, string>)

  return {
    metadataBase: new URL(baseUrl),
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
      languages: languageAlternates,
      canonical: currentUrl
    }
  }
}
