import React from 'react'
import { headers } from 'next/headers'
import { generateMetadata as baseGenerateMetadata } from '../metadata'
import { RootLayoutClient } from '@/components/root-layout'

// 生成 metadata
export async function generateMetadata({ params }: { params: { lang: string } }) {
  // 从请求头中获取当前路径
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || '/'
  const segments = pathname.split('/')
  const page = segments[segments.length - 1] || 'home'
  
  return baseGenerateMetadata({ params, page })
}

// 服务器端布局组件
export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={params.lang}>
      <body>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}
