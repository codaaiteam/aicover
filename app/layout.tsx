import "./globals.css";

import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { LanguageProvider } from "@/contexts/language";
import defaultTranslations from "@/locales/en.json";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mochi 1 Preview | Open Source Video Generation",
  description:
    "Experience state-of-the-art video generation with exceptional motion quality and prompt adherence, powered by our 10B parameter AsymmDiT architecture",
  keywords: "video generation, AI, machine learning, motion quality, open source",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <LanguageProvider defaultTranslations={defaultTranslations}>
            <Toaster position="top-center" richColors />
            {children}
            <Analytics />
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
