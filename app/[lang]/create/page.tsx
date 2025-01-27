'use client'

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language"
import styles from "./page.module.css"
import { Clock, Grid2X2, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const EXAMPLE_PROMPTS = [
  "A serene mountain lake at sunset with gentle ripples",
  "A bustling city street with time-lapse of people and traffic",
  "Cherry blossoms falling in a traditional Japanese garden",
]

interface Video {
  uuid: string;
  img_url: string;
  img_description: string;
  created_at: string;
}

export default function CreatePage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { t, currentLocale } = useLanguage()
  
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [remainingVideos, setRemainingVideos] = useState(2)
  const [resetTime, setResetTime] = useState("4:30 PM")
  const [recentVideos, setRecentVideos] = useState<Video[]>([])

  useEffect(() => {
    if (isLoaded && !user) {
      router.push(`/${currentLocale}/sign-in`)
    } else if (user) {
      fetchRecentVideos()
    }
  }, [user, isLoaded, router, currentLocale])

  const fetchRecentVideos = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/get-covers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: 1
        }),
      })
      const data = await response.json()
      console.log('Recent videos response:', data)
      if (data.code === 0 && data.data) {
        setRecentVideos(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch recent videos:', error)
    }
  }

  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/gen-cover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: prompt,
          negative_prompt: "blurry, low quality, distorted, pixelated"
        }),
      })

      const data = await response.json()
      
      if (data.code === 0 && data.data) {
        toast.success(t.videoGenerateSuccess || "Video generated successfully!")
        setRemainingVideos(prev => Math.max(0, prev - 1))
        await fetchRecentVideos()
        setPrompt("")
      } else {
        throw new Error(data.msg || "Failed to generate video")
      }
    } catch (error) {
      console.error("Failed to generate video:", error)
      toast.error(error instanceof Error ? error.message : "Failed to generate video")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className={styles.container}>
      <div className={styles.remainingCount}>
        <Clock size={16} />
        {remainingVideos} {t.fastVideosLeft || "fast videos left"} {t.until || "until"} {resetTime}
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>{t.createTitle || 'Create Your Video'}</h1>
        <p className={styles.subtitle}>
          {t.createDescription || 'Describe your video and watch it come to life'}
        </p>
      </header>

      <div className={styles.promptContainer}>
        <textarea
          className={styles.promptBox}
          placeholder={t.promptPlaceholder || "Describe your video..."}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <div className={styles.promptActions}>
          <Button
            onClick={handleSubmit}
            disabled={loading || !prompt.trim() || remainingVideos === 0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.generating || "Generating..."}
              </>
            ) : (
              t.generate || "Generate"
            )}
          </Button>
        </div>
      </div>

      <div className={styles.promptIdeas}>
        <button className={styles.promptIdea}>
          {t.needPromptIdeas || "Need prompt ideas?"}
        </button>
        {EXAMPLE_PROMPTS.map((example, index) => (
          <button
            key={index}
            className={styles.promptIdea}
            onClick={() => setPrompt(example)}
          >
            {example}
          </button>
        ))}
      </div>

      <div className={styles.recentTitle}>
        <h2 className={styles.recentHeading}>{t.recentCreations || "Your recent creations"}</h2>
        <a href={`/${currentLocale}/videos`} className={styles.viewAll}>
          <Grid2X2 size={16} />
          {t.viewAllCreations || "View all your creations"}
          <ArrowRight size={16} />
        </a>
      </div>

      <div className={styles.videoGrid}>
        {recentVideos.map((video) => {
          console.log('Processing video:', video);
          
          // 对 URL 进行正确的编码
          const url = new URL(video.img_url);
          const pathSegments = url.pathname.split('/');
          const filename = pathSegments.pop(); // 获取文件名
          const path = pathSegments.join('/'); // 获取路径
          
          // 重新构建 URL，只对文件名部分进行编码
          const fixedUrl = `${url.origin}${path}/${encodeURIComponent(filename || '')}`;
          
          console.log('Video URL:', {
            original: video.img_url,
            fixed: fixedUrl
          });
          
          return (
            <div key={video.uuid} className={styles.videoCard}>
              <video
                key={fixedUrl}
                src={fixedUrl}
                autoPlay
                loop
                muted
                playsInline
                controls
                onError={(e) => {
                  console.error('Video failed to load:', {
                    originalUrl: video.img_url,
                    fixedUrl,
                    error: e
                  });
                }}
                onLoadStart={() => console.log('Video load started:', fixedUrl)}
                onLoadedData={() => console.log('Video loaded successfully:', fixedUrl)}
                style={{ display: 'block' }}
                className={styles.videoElement}
              />
              <div className={styles.videoInfo}>
                <p className={styles.videoDescription}>{video.img_description}</p>
                <p className={styles.videoDate}>
                  {new Date(video.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
        {recentVideos.length === 0 && (
          <div className={styles.emptyState}>
            <p>{t.noVideosYet || "No videos yet. Create your first video!"}</p>
          </div>
        )}
      </div>
    </div>
  )
}
