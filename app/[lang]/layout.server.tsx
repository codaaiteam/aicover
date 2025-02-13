import React from 'react'
import ClientLayout from './layout.client'
import { generateMetadata as baseGenerateMetadata } from '../metadata'

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const segment = params.segment || 'home'
  return baseGenerateMetadata({ params, page: segment })
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <ClientLayout params={params}>
      {children}
    </ClientLayout>
  )
}
