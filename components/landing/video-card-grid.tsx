'use client'

import React from 'react'
import styles from './VideoCardGrid.module.css'
import { useLanguage } from "@/contexts/language"

interface VideoData {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
}

interface VideoCardGridProps {
  videos: VideoData[]
}

const videoData: VideoData[] = [
  {
    id: "1",
    title: "example1Short",
    description: "example1Long",
    videoUrl: "https://pub-de18dc3c90824394abf06cb24b33028d.r2.dev/mochi-gif/hero-image.mp4",
    thumbnailUrl: "/videos/thumb1.jpg"
  },
  {
    id: "2",
    title: "example2Short",
    description: "example2Long",
    videoUrl: "https://pub-de18dc3c90824394abf06cb24b33028d.r2.dev/mochi-gif/hero-image.mp4",
    thumbnailUrl: "/videos/thumb2.jpg"
  },
  {
    id: "3",
    title: "example3Short",
    description: "example3Long",
    videoUrl: "https://pub-de18dc3c90824394abf06cb24b33028d.r2.dev/mochi-gif/hero-image.mp4",
    thumbnailUrl: "/videos/thumb3.jpg"
  }
]

export default function VideoCardGrid({ videos = videoData }: VideoCardGridProps) {
  const { t } = useLanguage()

  return (
    <div className={styles.grid}>
      {videos.map((video) => (
        <div key={video.id} className={styles.card}>
          <div className="relative aspect-video">
            <video
              className="w-full h-full object-cover"
              src={video.videoUrl}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <div className={styles.content}>
            <h3>{t[video.title]}</h3>
            <p>{t[video.description]}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
