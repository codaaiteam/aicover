'use client'

import React from 'react'
import Template from './template'

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Template>
      {children}
    </Template>
  )
}
