'use client'

import { useEffect } from "react"
import { useClerk } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/contexts/language"

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentLocale } = useLanguage()

  useEffect(() => {
    const redirect_url = searchParams?.get("redirect_url") || `/${currentLocale}/create`
    
    async function handleCallback() {
      try {
        await handleRedirectCallback({
          redirectUrl: redirect_url,
          afterSignInUrl: redirect_url,
          afterSignUpUrl: redirect_url,
        })
      } catch (err) {
        console.error("Error handling callback:", err)
        router.push(`/${currentLocale}/sign-in`)
      }
    }

    handleCallback()
  }, [handleRedirectCallback, router, searchParams, currentLocale])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Completing sign in...</h2>
        <p className="text-sm text-muted-foreground mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}
