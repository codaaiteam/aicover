'use client'

import { redirect } from 'next/navigation'
import LandingPage from '../(landing)/page'

const validLanguages = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it']

export default function LocalizedPage({ params }: { params: { lang: string } }) {
  const { lang } = params

  if (!validLanguages.includes(lang)) {
    redirect('/en')
  }

  return <LandingPage />
}
