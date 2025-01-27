'use client'

import React from 'react'
import Image from 'next/image'
import styles from './feature-card.module.css'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className={styles.card}>
      <Image src={icon} width={50} height={50} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
