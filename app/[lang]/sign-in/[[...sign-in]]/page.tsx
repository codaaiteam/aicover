'use client'

import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-black hover:bg-gray-800',
            footerActionLink: 'text-black hover:text-gray-800',
          },
        }}
      />
    </div>
  )
}
