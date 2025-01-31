'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import styles from './page.module.css'

const ClientVideo = dynamic(
  () => import('@/components/ClientVideo'),
  {
    ssr: false,
    loading: () => <div>Loading...</div>
  }
)

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.left}>
          <h1>AI Cover: Professional Video Cover Generation</h1>
          <p>Generate professional video covers for your content with AI</p>
          <button className={styles.ctaButton}>
            Try Now
          </button>
        </div>
        <div className={styles.right}>
          <ClientVideo
            src="https://pub-de18dc3c90824394abf06cb24b33028d.r2.dev/mochi-gif/hero-image.mp4"
            className={styles.heroVideo}
            width={500}
            height={500}
          />
        </div>
      </section>
    </main>
  )
}