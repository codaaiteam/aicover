'use client'

import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import LanguageSwitcher from "@/components/landing/language-switcher"
import { useLanguage } from "@/contexts/language"

export default function Navbar() {
  const router = useRouter()
  const params = useParams()
  const { t } = useLanguage()
  const currentLocale = (params?.lang as string) || 'en'

  const getGuidePath = () => {
    return currentLocale === 'en' ? '/guide' : `/${currentLocale}/guide`
  }

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mochi 1
        </h1>
      </Link>
      <div className="flex items-center gap-x-6">
        <Link href={currentLocale === 'en' ? '/' : `/${currentLocale}`}>
          <Button variant="ghost" className="text-gray-900 dark:text-white">
            {t.home || 'Home'}
          </Button>
        </Link>
        <Link href={getGuidePath()}>
          <Button variant="ghost" className="text-gray-900 dark:text-white">
            {t.guide || 'Guide'}
          </Button>
        </Link>
        <LanguageSwitcher />
        <Button 
          onClick={() => console.log('Sign in clicked')} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          {t.tryNow || 'Try Now'}
        </Button>
      </div>
    </nav>
  )
}
