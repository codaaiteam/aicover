'use client'

import React from "react"
import { useLanguage } from "@/contexts/language"
import { useParams } from "next/navigation"
import styles from "./page.module.css"

interface PromptExampleProps {
  t: {
    example1Title?: string;
    example1Short?: string;
    example1Long?: string;
    example2Title?: string;
    example2Short?: string;
    example2Long?: string;
    example3Title?: string;
    example3Short?: string;
    example3Long?: string;
    [key: string]: string | undefined;
  };
  title: string;
  shortPrompt: string;
  longPrompt: string;
  video: {
    src: string;
    width: number;
    height: number;
    className: string;
  };
}

const PromptExample = ({ t, title, shortPrompt, longPrompt, video }: PromptExampleProps) => (
  <div className={styles.card}>
    <h3>{title}</h3>
    <div className={styles.promptContent}>
      <div className={styles.promptText}>
        <div className={styles.shortPrompt}>
          <h4>{t.simplePrompt || 'Simple Prompt:'}</h4>
          <p>{shortPrompt}</p>
        </div>
        <div className={styles.longPrompt}>
          <h4>{t.descriptivePrompt || 'Descriptive Prompt:'}</h4>
          <p>{longPrompt}</p>
        </div>
      </div>
      <div className={styles.promptImage}>
        <video
          src={video.src}
          alt={title}
          width={video.width}
          height={video.height}
          className={video.className}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  </div>
);

export default function GuidePage() {
  const { t, currentLocale } = useLanguage()

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>{t.guideTitle || 'Master the Art of Mochi Video Prompts'}</h1>
          <p className={styles.description}>{t.guideDescription || 'Learn how to create compelling prompts for generating impressive AI videos with Mochi'}</p>
        </section>

        <section className={styles.bestPractices}>
          <h2>{t.bestPracticesTitle || 'Best Practices for Writing Prompts'}</h2>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h3>{t.practiceSpecificTitle || 'Be Specific'}</h3>
              <p>{t.practiceSpecificDesc || 'Include detailed descriptions of scenes, movements, and atmosphere you want to create.'}</p>
            </div>
            <div className={styles.card}>
              <h3>{t.practiceSceneTitle || 'Set the Scene'}</h3>
              <p>{t.practiceSceneDesc || 'Describe the environment, lighting, and time of day to establish the right mood.'}</p>
            </div>
            <div className={styles.card}>
              <h3>{t.practiceMotionTitle || 'Include Motion'}</h3>
              <p>{t.practiceMotionDesc || 'Specify how elements should move and interact within the scene.'}</p>
            </div>
            <div className={styles.card}>
              <h3>{t.practiceAtmosphereTitle || 'Add Atmosphere'}</h3>
              <p>{t.practiceAtmosphereDesc || 'Include sensory details like sounds, lighting, and weather conditions.'}</p>
            </div>
          </div>
        </section>

        <section className={styles.examples}>
          <h2>{t.examplePromptsTitle || 'Example Prompts'}</h2>
          <div className={styles.examplesGrid}>
            <PromptExample
              t={t}
              title={t.example1Title || 'Surreal Sky Kingdom'}
              shortPrompt={t.example1Short || 'SURREAL SKY KINGDOM IN A GLASS GLOBE'}
              longPrompt={t.example1Long || 'Within the confines of a massive glass globe, floating high above a vast, turbulent sea, lies a surreal kingdom in the sky. Jagged cliffs rise from the clouds, dotted with ethereal castles connected by delicate, glowing bridges. The sky is a swirl of colours, a sunset that never ends, bathing the world in soft pinks, purples, and gold.'}
              video={{
                src: "https://pub-de18dc3c90824394abf06cb24b33028d.r2.dev/mochi-gif/sky-kingdom.mp4",
                width: 400,
                height: 225,
                className: styles.exampleImage
              }}
            />
            <PromptExample
              t={t}
              title={t.example2Title || 'Rural Village at Sunrise'}
              shortPrompt={t.example2Short || 'RURAL VILLAGE AT SUNRISE'}
              longPrompt={t.example2Long || 'A quiet rural village awakens as the first light of dawn breaks over the horizon. The soft glow of the sun gently illuminates the rooftops of small stone cottages, casting long shadows across fields of golden wheat. Birds begin to chirp, and a thin mist lingers just above the ground.'}
              video={{
                src: "https://pub-de18dc3c90824394abf06cb24b33028d.r2.dev/mochi-gif/rural-village.mp4",
                width: 400,
                height: 225,
                className: styles.exampleImage
              }}
            />
            <PromptExample
              t={t}
              title={t.example3Title || 'City Street Market'}
              shortPrompt={t.example3Short || 'CITY STREET MARKET IN THE EARLY MORNING'}
              longPrompt={t.example3Long || 'In the heart of a bustling city, a street market comes to life in the early hours of the morning. Vendors set up their stalls, displaying fresh produce, colourful fruits, vegetables, and local goods. The camera pans across the market, capturing the sounds of conversations.'}
              video={{
                src: "https://pub-de18dc3c90824394abf06cb24b33028d.r2.dev/mochi-gif/street-market.mp4",
                width: 400,
                height: 225,
                className: styles.exampleImage
              }}
            />
          </div>
        </section>

        <section className={styles.structure}>
          <h2>{t.promptStructureTitle || 'Prompt Structure'}</h2>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h3>{t.structure1Title || '1. Scene Setting'}</h3>
              <p>{t.structure1Desc || 'Start with the location and time of day'}</p>
              <div className={styles.example}>{t.structure1Example || 'Example: "In a sunlit forest clearing..."'}</div>
            </div>
            
            <div className={styles.card}>
              <h3>{t.structure2Title || '2. Main Elements'}</h3>
              <p>{t.structure2Desc || 'Describe the key subjects and their actions'}</p>
              <div className={styles.example}>{t.structure2Example || 'Example: "A group of construction workers carefully move across steel beams..."'}</div>
            </div>
            
            <div className={styles.card}>
              <h3>{t.structure3Title || '3. Atmosphere'}</h3>
              <p>{t.structure3Desc || 'Add details about lighting, weather, and mood'}</p>
              <div className={styles.example}>{t.structure3Example || 'Example: "The warm afternoon sun casts long shadows..."'}</div>
            </div>
            
            <div className={styles.card}>
              <h3>{t.structure4Title || '4. Camera Movement'}</h3>
              <p>{t.structure4Desc || 'Specify how the scene should be captured'}</p>
              <div className={styles.example}>{t.structure4Example || 'Example: "The camera slowly pans across the scene..."'}</div>
            </div>
          </div>
        </section>

        <section className={styles.tips}>
          <h2>{t.proTipsTitle || 'Pro Tips'}</h2>
          <ul className={styles.tipsList}>
            <li>{t.proTip1 || 'Create custom prompts for specific outputs rather than relying on prompt refinement'}</li>
            <li>{t.proTip2 || 'Focus on natural movements and realistic scenarios for better results'}</li>
            <li>{t.proTip3 || 'Include camera movement descriptions to guide the video flow'}</li>
            <li>{t.proTip4 || 'Generate one video at a time for optimal results'}</li>
            <li>{t.proTip5 || 'Test both simple and detailed prompts to find what works best for your needs'}</li>
          </ul>
        </section>

        <section className={styles.cta}>
          <h2>{t.ctaTitle || 'Ready to Get Started?'}</h2>
          <p>{t.ctaDescription || 'Transform your ideas into stunning videos today!'}</p>
          <a 
            href={`/${currentLocale}/create`}
            className={styles.ctaButton}
          >
            {t.ctaButton || 'Get Started Now'}
          </a>          
        </section>
      </main>
    </div>
  )
}
