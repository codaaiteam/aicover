'use client'

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language"
import styles from "./page.module.css"
import { Clock, Grid2X2, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ApiResponse, Video } from '@/types/api'

const EXAMPLE_PROMPTS = [
  "A serene mountain lake at sunset with gentle ripples",
  "A bustling city street with time-lapse of people and traffic",
  "Cherry blossoms falling in a traditional Japanese garden",
]

export default function CreatePage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { t, currentLocale } = useLanguage()
  
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [remainingVideos, setRemainingVideos] = useState(2)
  const [resetTime, setResetTime] = useState("4:30 PM")
  const [recentVideos, setRecentVideos] = useState<Video[]>([])
  const [publicVideos, setPublicVideos] = useState<Video[]>([])

  useEffect(() => {
    // 获取公共视频
    fetchPublicVideos()
    // 如果用户已登录，获取用户视频
    if (user) {
      fetchRecentVideos()
    }
  }, [user])

  const fetchPublicVideos = async () => {
    try {
      const response = await fetch('/api/videos/public')
      const data = (await response.json()) as ApiResponse<Video[]>
      if (data.code === 0 && data.data) {
        setPublicVideos(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch public videos:', error)
    }
  }

  const fetchRecentVideos = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/videos/recent')
      const data = (await response.json()) as ApiResponse<Video[]>
      if (data.code === 0 && data.data) {
        setRecentVideos(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch recent videos:', error)
    }
  }

  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return
    
    if (!user) {
      toast.error(t.pleaseLoginFirst || "Please login to generate videos")
      router.push('/sign-in')
      return
    }

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

      const data = (await response.json()) as ApiResponse<{ url: string }>
      
      if (data.code === 0 && data.data) {
        toast.success(t.videoGenerateSuccess || "Video generated successfully!")
        setRemainingVideos(prev => Math.max(0, prev - 1))
        await fetchRecentVideos()
        setPrompt("")
      } else {
        throw new Error(data.message || "Failed to generate video")
      }
    } catch (error) {
      console.error("Failed to generate video:", error)
      toast.error(error instanceof Error ? error.message : "Failed to generate video")
    } finally {
      setLoading(false)
    }
  }

  const renderVideoGrid = (videos: Video[], title: string) => (
    <>
      <div className={styles.recentTitle}>
        <h2 className={styles.recentHeading}>{title}</h2>
        {user && (
          <a href={`/${currentLocale}/videos`} className={styles.viewAll}>
            <Grid2X2 size={16} />
            {t.viewAllCreations || "View all your creations"}
            <ArrowRight size={16} />
          </a>
        )}
      </div>
  
      <div className={styles.videoGrid}>
        {videos.map((video) => {
          // 保持 URL 处理逻辑
          console.log('处理视频 URL:', video.img_url);

          const url = new URL(video.img_url);
          const pathSegments = url.pathname.split('/');
          const filename = pathSegments.pop();
          const path = pathSegments.join('/');
          const fixedUrl = `${url.origin}${path}/${encodeURIComponent(filename || '')}`;
          console.log('处理后的 URL:', fixedUrl);

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
                className={styles.videoElement}
                onError={(e) => {
                  console.error('Video load error for URL:', fixedUrl);
                }}
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
        {videos.length === 0 && (
          <div className={styles.emptyState}>
            <p>{t.noVideosYet || "No videos yet"}</p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className={styles.container}>
      {user && (
        <div className={styles.remainingCount}>
          <Clock size={16} />
          {remainingVideos} {t.fastVideosLeft || "fast videos left"} {t.until || "until"} {resetTime}
        </div>
      )}

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
            disabled={loading || !prompt.trim()}
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

      {/* 用户已登录时显示其视频 */}
      {user && renderVideoGrid(recentVideos, t.recentCreations || "Your recent creations")}
      
      {/* 显示公共视频 */}
      {renderVideoGrid(publicVideos, t.communityCreations || "Community creations")}
    </div>
  )
}
