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
import { AppContext } from "@/contexts/AppContext"
import { useContext } from "react"
import { GenerationSettingsButton } from "@/components/generation-settings"
import { GenerationSettings, defaultSettings } from '@/types/generation-settings'

const EXAMPLE_PROMPTS = [
  "A serene mountain lake at sunset with gentle ripples",
  "A bustling city street with time-lapse of people and traffic",
  "Cherry blossoms falling in a traditional Japanese garden",
]

export default function CreatePage() {
  const { user, isLoaded } = useUser();  // useUser 只提供这两个属性
  console.log('Clerk auth state:', { 
    isLoaded,
    isAuthenticated: !!user,  // 使用 user 是否存在来判断登录状态
    userId: user?.id,
    userEmail: user?.emailAddresses[0]?.emailAddress 
  });
  const router = useRouter()
  const { t, currentLocale } = useLanguage()
  
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [remainingVideos, setRemainingVideos] = useState(2)
  const [resetTime, setResetTime] = useState("4:30 PM")
  const [recentVideos, setRecentVideos] = useState<Video[]>([])
  const [publicVideos, setPublicVideos] = useState<Video[]>([])
  const [generationStatus, setGenerationStatus] = useState("")
  const [generationSettings, setGenerationSettings] = useState<GenerationSettings>(defaultSettings)
  // 在现有 context 获取后添加
  const context = useContext(AppContext);
  console.log('AppContext value:', context);

  // 然后再解构
  const { pendingTasks, addPendingTask, removePendingTask } = context;
  console.log('Destructured values:', { pendingTasks, addPendingTask, removePendingTask });
  // const { pendingTasks, addPendingTask, removePendingTask } = useContext(AppContext)

  // 先定义响应类型
  interface GenCoverResponse {
    code: number;
    data?: {
      uuid: string;
    };
    message?: string;
  }
  interface ApiResponse<T> {
    code: number;
    message?: string;
    data?: T;
  }
  
  interface GenerationResponse {
    uuid: string;
    status: number;
  }
  
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
    if (!prompt.trim() || loading) return;
    
    if (!user) {
      toast.error(t.pleaseLoginFirst || "Please login to generate videos");
      router.push('/sign-in');
      return;
    }
  
    setLoading(true);
    try {
      console.log('Starting video generation with prompt:', prompt);
      
      const response = await fetch('/api/gen-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: prompt,
          negative_prompt: generationSettings.negativePrompt,
          seed: generationSettings.customSeed ? generationSettings.seed : undefined,
          enable_prompt_expansion: generationSettings.enablePromptEnhancement
        }),
      });
  
      // 添加响应状态检查
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response not ok:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
  
      const result = await response.json() as ApiResponse<GenerationResponse>;
      // console.log('API Response:', result);
  
      if (result.code !== 0 || !result.data?.uuid) {
        console.error('API Error:', result);
        throw new Error(result.message || "Failed to start generation");
      }
      // 提取 uuid 确保存在性
      const { uuid } = result.data;
      // 添加到待处理任务列表
      if (typeof addPendingTask === 'function') {
        addPendingTask({
          uuid: uuid,
          description: prompt,
          startTime: Date.now()
        });
      } else {
        console.error('addPendingTask is not a function:', addPendingTask);
      }
  
      setPrompt("");
      toast.success("视频开始生成，您可以离开此页面");
  
      // 开始轮询状态
      // 修改检查状态的部分
      const checkStatus = async () => {
        try {
          const statusResp = await fetch(`/api/videos/status/${uuid}`);
          const statusData = await statusResp.json() as ApiResponse<{ 
            status: number;
            error?: string;
            video_url?: string;
          }>; // 添加类型断言

          console.log('Status check response:', statusData);
          
          if (statusData.code === 0 && statusData.data) {
            const status = statusData.data.status;
            
            if (status === 1) {
              toast.success(t.videoGenerateSuccess || "Video generated successfully!");
              await fetchRecentVideos();
              removePendingTask(uuid);
            } else if (status === 2) {
              removePendingTask(uuid);
              throw new Error(statusData.data.error || "Generation failed");
            } else {
              setTimeout(checkStatus, 5000);
            }
          } else {
            throw new Error(statusData.message || "Failed to check status");
          }
        } catch (error) {
          console.error('Status check error:', error);
          throw error;
        }
      };
  
      checkStatus();
  
    } catch (error) {
      console.error("Full error details:", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast.error(error instanceof Error ? error.message : "Failed to generate video");
    } finally {
      setLoading(false);
    }
};

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
        let fixedUrl = video.img_url;
        
        // 只有当 URL 有效时才进行处理
        if (video.img_url && video.img_url.startsWith('http')) {
          try {
            const url = new URL(video.img_url);
            const pathSegments = url.pathname.split('/');
            const filename = pathSegments.pop();
            const path = pathSegments.join('/');
            fixedUrl = `${url.origin}${path}/${encodeURIComponent(filename || '')}`;
          } catch (error) {
            console.error('Invalid video URL:', video.img_url);
            // 使用原始 URL 或者一个默认的错误图像
            fixedUrl = video.img_url || '/placeholder-video.mp4';
          }
        }

        return (
          <div key={video.uuid} className={styles.videoCard}>
            {fixedUrl ? (
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
            ) : (
              <div className={styles.videoPlaceholder}>
                Video not available
              </div>
            )}
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
  const hasPendingTasks = Array.isArray(pendingTasks) && pendingTasks.length > 0;

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
        <div className="mt-2">
          <GenerationSettingsButton 
            settings={generationSettings}
            onSettingsChange={setGenerationSettings}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading || !prompt.trim()}
            className="h-10 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
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

      {hasPendingTasks && (
        <div className={styles.pendingTasks}>
          <h3>{t.pendingTasks || "Pending Tasks"}</h3>
          {pendingTasks.map(task => (
            <div key={task.uuid} className={styles.pendingTask}>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{task.description}</span>
              <span className={styles.timeElapsed}>
                {Math.floor((Date.now() - task.startTime) / 1000)}s
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 用户已登录时显示其视频 */}
      {user && renderVideoGrid(recentVideos, t.recentCreations || "Your recent creations")}
      
      {/* 显示公共视频 */}
      {renderVideoGrid(publicVideos, t.communityCreations || "Community creations")}
    </div>
  )
}
