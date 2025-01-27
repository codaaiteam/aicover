'use client'

import React, { useState } from 'react'
import styles from './question-faq.module.css'

interface QuestionFAQProps {
  question: string
  answer: string
}

export default function QuestionFAQ({ question, answer }: QuestionFAQProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.container}>
      <button
        className={`${styles.question} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className={styles.answer}>
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}
