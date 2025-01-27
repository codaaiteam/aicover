'use client'

import { SignUp } from "@clerk/nextjs"
import { useLanguage } from "@/contexts/language"

export default function SignUpPage() {
  const { currentLocale } = useLanguage()

  return (
    <div className="container relative flex h-[800px] flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up to get started
          </p>
        </div>
        <SignUp 
          path={`/${currentLocale}/sign-up`}
          routing="path"
          signInUrl={`/${currentLocale}/sign-in`}
          redirectUrl={`/${currentLocale}`}
        />
      </div>
    </div>
  )
}
