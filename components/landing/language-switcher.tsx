'use client'

import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language"
import { useParams } from "next/navigation"

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' }
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const params = useParams()
  const { currentLocale } = useLanguage()
  
  // 使用 URL 参数或默认值作为当前语言
  const displayLocale = currentLocale || (params?.lang as string) || 'en'

  const switchLanguage = (locale: string) => {
    const path = window.location.pathname
    const newPath = path.startsWith(`/${displayLocale}`)
      ? path.replace(`/${displayLocale}`, `/${locale}`)
      : `/${locale}${path}`
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {displayLocale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(({ code, name }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => switchLanguage(code)}
            className={displayLocale === code ? 'bg-gray-100 dark:bg-gray-800' : ''}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
