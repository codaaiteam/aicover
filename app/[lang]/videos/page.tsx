'use client'

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language"
import { Button } from "@/components/ui/button"

export default function VideosPage() {
  const { user } = useUser()
  const router = useRouter()
  const { t, currentLocale } = useLanguage()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push(`/${currentLocale}/sign-in`)
      return
    }

    fetchVideos()
  }, [user, router, currentLocale])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/videos/recent')
      const data = await response.json()
      // console.log('API Response:', data)
      
      if (data.code === 0 && data.data) {
        // console.log('Setting videos:', data.data)
        setVideos(data.data)
      } else {
        // console.error('API Error:', data.message)
        setError(data.message || 'Failed to load videos')
      }
    } catch (err) {
      console.error('Fetch Error:', err)
      setError('Failed to fetch videos')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t.yourVideos || 'Your Videos'}</h1>
          <p className="text-muted-foreground mt-2">
            {t.manageVideos || 'View and manage your generated videos'}
          </p>
        </div>
        <Button onClick={() => router.push(`/${currentLocale}/create`)}>
          {t.generateNew || 'Generate New Video'}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t.loading || 'Loading videos...'}</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchVideos}>
            {t.tryAgain || 'Try Again'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos?.map((video) => (
            <div key={video.id} className="relative rounded-lg overflow-hidden border border-gray-200">
              {video.img_url ? (
                <video
                  src={video.img_url}
                  className="w-full aspect-video object-cover"
                  controls
                  muted
                />
              ) : (
                <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                  {video.status === 0 ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">{t.generating || 'Generating...'}</p>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-red-500">{t.generationFailed || 'Generation failed'}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {t.errors?.video?.[video.error_reason] || t.errors?.video?.unknown}
                      </p>
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(video.created_at).toLocaleString()}
                </p>
                <p className="text-sm">{video.img_description}</p>
              </div>
            </div>
          ))}
          {!videos?.length && (
            <div className="text-center text-muted-foreground py-20 col-span-3">
              {t.noVideos || 'No videos yet. Start by generating one!'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
