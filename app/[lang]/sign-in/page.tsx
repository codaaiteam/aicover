'use client'

import { SignIn } from "@clerk/nextjs"
import { useLanguage } from "@/contexts/language"

export default function SignInPage() {
  const { currentLocale } = useLanguage()

  return (
    <div className="container relative flex h-[800px] flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <SignIn 
          afterSignInUrl={`/${currentLocale}/create`}
          redirectUrl={`/${currentLocale}/create`}
          path={`/${currentLocale}/sign-in`}
          routing="path"
          signUpUrl={`/${currentLocale}/sign-up`}
        />
      </div>
    </div>
  )
}
