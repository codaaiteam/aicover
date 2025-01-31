"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DEFAULT_LANGUAGE = 'en';
const VALID_LANGUAGES = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it'];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Detect language from browser or stored preference
    const detectLanguage = () => {
      // First, check for stored language
      const storedLanguage = localStorage.getItem('NEXT_LOCALE');
      if (storedLanguage && VALID_LANGUAGES.includes(storedLanguage)) {
        return storedLanguage;
      }

      // Then, check browser language
      const browserLanguage = navigator.language.split('-')[0];
      if (VALID_LANGUAGES.includes(browserLanguage)) {
        return browserLanguage;
      }

      // Fallback to default
      return DEFAULT_LANGUAGE;
    };

    const language = detectLanguage();
    router.replace(`/${language}`);
  }, [router]);

  // Show a loading state
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
