'use client'

import React from 'react'
import Template from './template'

// 客户端布局组件
export default function CreateLayout({
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
