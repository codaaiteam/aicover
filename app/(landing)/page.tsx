'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language'
import styles from './page.module.css'
import FeatureCard from '@/components/landing/feature-card'
import QuestionFAQ from '@/components/landing/question-faq'
import videoData from '@/data/videoData'

export default function Home() {
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const currentLocale = (params?.lang as string) || 'en'

  const handleTryNow = () => {
    router.push(currentLocale === 'en' ? '/create' : `/${currentLocale}/create`)
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.left}>
          <h1>{t.title || 'AI Cover: Professional Video Cover Generation'}</h1>
          <p>{t.description || 'Generate professional video covers for your content with AI. Perfect for YouTube, social media, and more.'}</p>
          <button 
            className={styles.ctaButton}
            onClick={handleTryNow}
          >
            {t.tryNow || 'Try Now'}
          </button>
        </div>
        <div className={styles.right}>
          <video
            src="https://pub-de18dc3c90824394abf06cb24b33028d.r2.dev/mochi-gif/hero-image.mp4"
            className={styles.heroVideo}
            width={500}
            height={500}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
          />
        </div>
      </section>

      <section id="videos" className={styles.videos}>
        <div className={styles.videosContent}>
          <h2 className={styles.sectionTitle}>{t.seeInAction || 'Featured Examples'}</h2>
          <p>{t.videoDescription || 'See how AI Cover can transform your videos with professional covers'}</p>
          <div className={styles.grid}>
            {videoData.map((video, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.videoContainer}>
                  <video
                    src={video.url}
                    className={styles.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                  />
                </div>
                <div className={styles.content}>
                  <h3>{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.moreButtonContainer}>
            <Link href="/explore" className={styles.moreButton}>
              {t.moreVideos || 'More Videos'}
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2>{t.unleashCreativity || 'Unleash Your Creativity'}</h2>
        <div className={styles.featureGrid}>
          <FeatureCard
            icon="/icon-text-to-video.svg"
            title={t.feature1Title || 'AI-Powered Generation'}
            description={t.feature1Description || 'State-of-the-art AI models to create stunning video covers'}
          />
          <FeatureCard
            icon="/icon-effortless.svg"
            title={t.feature2Title || 'Effortless Creation'}
            description={t.feature2Description || 'Generate professional covers in seconds with simple prompts'}
          />
          <FeatureCard
            icon="/icon-ai-production.svg"
            title={t.feature3Title || 'High Quality Output'}
            description={t.feature3Description || 'Get high-resolution, visually appealing covers every time'}
          />
          <FeatureCard
            icon="/icon-realistic.svg"
            title={t.feature4Title || 'Customizable Styles'}
            description={t.feature4Description || 'Choose from various styles to match your brand and content'}
          />
          <FeatureCard
            icon="/icon-time-saving.svg"
            title={t.feature5Title || 'Time-Saving'}
            description={t.feature5Description || 'Save hours of manual editing and design work'}
          />
          <FeatureCard
            icon="/icon-multi-language.svg"
            title={t.feature6Title || 'Multi-Language Support'}
            description={t.feature6Description || 'Create covers in multiple languages for global reach'}
          />
        </div>
      </section>

      <section className={styles.howTo}>
        <h2>{t.howToUse || 'How to Use AI Cover'}</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>{t.step1Title || 'Upload Your Video'}</h3>
            <p>{t.step1Description || 'Upload your video or provide a YouTube URL'}</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>{t.step2Title || 'Describe Your Cover'}</h3>
            <p>{t.step2Description || 'Enter a description or choose from templates'}</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>{t.step3Title || 'Generate & Download'}</h3>
            <p>{t.step3Description || 'Get your professional cover in seconds'}</p>
          </div>
        </div>
      </section>

      <section className={styles.userReviews}>
        <h2>{t.userReviews || 'What Users Say'}</h2>
        <div className={styles.reviewGrid}>
          <div className={styles.review}>
            <div className={styles.reviewContent}>
              <p>{t.review1 || 'AI Cover has revolutionized how I create thumbnails for my YouTube channel.'}</p>
            </div>
            <div className={styles.reviewer}>
              <img src="/auth-01.png" alt="User" className={styles.avatar} />
              <div className={styles.rating}>★★★★★</div>
            </div>
          </div>
          <div className={styles.review}>
            <div className={styles.reviewContent}>
              <p>{t.review2 || 'The quality and speed of generation are incredible. Saves me hours of work.'}</p>
            </div>
            <div className={styles.reviewer}>
              <img src="/auth-02.png" alt="User" className={styles.avatar} />
              <div className={styles.rating}>★★★★★</div>
            </div>
          </div>
          <div className={styles.review}>
            <div className={styles.reviewContent}>
              <p>{t.review3 || 'Perfect for creating consistent, professional covers across all my content.'}</p>
            </div>
            <div className={styles.reviewer}>
              <img src="/auth-03.png" alt="User" className={styles.avatar} />
              <div className={styles.rating}>★★★★★</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.faq}>
        <h2>{t.faq || 'Frequently Asked Questions'}</h2>
        <QuestionFAQ
          question={t.faq1Question || 'What is AI Cover?'}
          answer={t.faq1Answer || 'AI Cover is a professional tool that uses artificial intelligence to generate high-quality video covers and thumbnails.'}
        />
        <QuestionFAQ
          question={t.faq2Question || 'How does it work?'}
          answer={t.faq2Answer || 'Simply upload your video or provide a URL, describe the cover you want, and our AI will generate it in seconds.'}
        />
        <QuestionFAQ
          question={t.faq3Question || 'What formats are supported?'}
          answer={t.faq3Answer || 'We support all major video formats and YouTube URLs. Generated covers are available in JPG and PNG formats.'}
        />
        <QuestionFAQ
          question={t.faq4Question || 'Can I customize the style?'}
          answer={t.faq4Answer || 'Yes, you can choose from various styles and customize elements like text, colors, and layout.'}
        />
      </section>

      <section className={styles.cta}>
        <h2>{t.ctaTitle || 'Create Your First Cover'}</h2>
        <p>{t.ctaDescription || 'Join thousands of content creators using AI Cover'}</p>
        <button className={styles.ctaButton}>
          {t.ctaButton || 'Get Started Free'}
        </button>
      </section>
    </main>
  )
}
