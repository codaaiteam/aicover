'use client'

import React from 'react'
import { Header } from "@/components/header"
import Footer from "@/components/landing/footer"
import { Toaster } from 'sonner'

export default function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
