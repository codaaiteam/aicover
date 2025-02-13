'use client'

import React from 'react'
import { Header } from "./header"
import Footer from "./footer"
import { Toaster } from 'sonner'

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
