'use client'

import { useLanguage } from "@/contexts/language"

export default function TermsPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        {t.termsTitle || 'Terms of Service'}
      </h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <h2>{t.termsLastUpdated || 'Last Updated'}: 2024-01-29</h2>
        
        <p className="text-gray-600 dark:text-gray-400">
          {t.termsIntro || 'Welcome to Mochi 1. By accessing our website and using our services, you agree to these terms of service.'}
        </p>

        <h3>{t.termsUsage || 'Usage Terms'}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t.termsUsageContent || 'You agree to use our services only for lawful purposes and in accordance with these Terms.'}
        </p>

        <h3>{t.termsContent || 'Content'}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t.termsContentText || 'You retain ownership of any content you create using our service. However, you grant us a license to use, store, and display your content.'}
        </p>

        <h3>{t.termsLimitations || 'Limitations'}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t.termsLimitationsText || 'We reserve the right to limit or terminate access to our services at our discretion.'}
        </p>

        <h3>{t.termsChanges || 'Changes to Terms'}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t.termsChangesText || 'We may modify these terms at any time. Continued use of our services constitutes acceptance of any changes.'}
        </p>
      </div>
    </div>
  )
}
