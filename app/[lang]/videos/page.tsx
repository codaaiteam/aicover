'use client'

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language"
import { Button } from "@/components/ui/button"

export default function VideosPage() {
  const { user } = useUser()
  const router = useRouter()
  const { t, currentLocale } = useLanguage()

  useEffect(() => {
    if (!user) {
      router.push(`/${currentLocale}/sign-in`)
    }
  }, [user, router, currentLocale])

  if (!user) {
    return null
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Videos</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your generated videos
          </p>
        </div>
        <Button onClick={() => router.push(`/${currentLocale}/create`)}>
          Generate New Video
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* TODO: Add video cards here */}
        <div className="text-center text-muted-foreground py-20">
          No videos yet. Start by generating one!
        </div>
      </div>
    </div>
  )
}
