'use client'

import React, { useEffect, useRef } from 'react'

export default function ClientVideo({
  src,
  className,
  width,
  height
}: {
  src: string
  className?: string
  width?: number
  height?: number
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const videoElement = videoRef.current
    if (videoElement) {
      // Ensure play is only called on the client
      videoElement.play().catch(error => {
        console.warn('Autoplay was prevented:', error)
      })
    }
  }, [])

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      width={width}
      height={height}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"  
    />
  )
}