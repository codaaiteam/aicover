'use client'

import { useLanguage } from "@/contexts/language"

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        {t.privacyTitle || 'Privacy Policy'}
      </h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <h2>{t.privacyLastUpdated || 'Last Updated'}: 2024-01-29</h2>
        
        <p className="text-gray-600 dark:text-gray-400">
          {t.privacyIntro || 'Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.'}
        </p>

        <h3>{t.privacyCollection || 'Information We Collect'}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t.privacyCollectionText || 'We collect information you provide directly to us, including account information and usage data.'}
        </p>

        <h3>{t.privacyUse || 'How We Use Your Information'}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t.privacyUseText || 'We use your information to provide and improve our services, communicate with you, and ensure security.'}
        </p>

        <h3>{t.privacySharing || 'Information Sharing'}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t.privacySharingText || 'We do not sell your personal information. We may share information with service providers who assist us in operating our website.'}
        </p>

        <h3>{t.privacySecurity || 'Security'}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t.privacySecurityText || 'We implement appropriate security measures to protect your personal information.'}
        </p>

        <h3>{t.privacyChanges || 'Changes to Privacy Policy'}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t.privacyChangesText || 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.'}
        </p>

        <h3>{t.privacyContact || 'Contact Us'}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t.privacyContactText || 'If you have any questions about this Privacy Policy, please contact us at:'} me@idoubi.cc
        </p>
      </div>
    </div>
  )
}
