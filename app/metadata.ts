import { Metadata } from 'next'

export async function generateMetadata({ params: { lang = 'en' } }: { params: { lang?: string } }): Promise<Metadata> {
  // Dynamically import the language file
  const translations = await import(`@/locales/${lang}.json`)

  return {
    title: translations.title,
    description: translations.description,
    keywords: [
      'Mochi 1 Preview', 
      'Mochi AI', 
      'Genmo Mochi', 
      'AI Video Preview', 
      'Text to Video AI',
      'Next-Gen Video Creation',
      'AI Video Generator',
      'Mochi Video Technology',
      'Advanced AI Animation',
      'Visual Storytelling'
    ],
    openGraph: {
      title: translations.title,
      description: translations.description,
      type: 'website',
      url: 'https://mochi1preview.com',
      images: [{ url: 'https://mochi1preview.com/og-image.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: translations.title,
      description: translations.description,
      images: ['https://mochi1preview.com/twitter-image.png'],
    },
    robots: 'index, follow',
    alternates: {
      canonical: 'https://mochi1preview.com/'
    },
    authors: [{ name: "Genmo AI" }],
    applicationName: "Mochi 1 Preview",
  }
}
