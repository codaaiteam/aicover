import "./globals.css";

import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/contexts/language";
import defaultTranslations from "@/locales/en.json";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mochi 1 Preview | Open Source Video Generation",
  description:
    "Experience state-of-the-art video generation with exceptional motion quality and prompt adherence, powered by our 10B parameter AsymmDiT architecture",
  keywords: "video generation, AI, machine learning, motion quality, open source",
  authors: [{ name: "Genmo AI" }],
  applicationName: "Mochi 1 Preview",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "O_PEb7XrNO2XGoETepMtJp-a4LSDyuO2xi3N4H5zOu0",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
      afterSignUpUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
    >
      <html lang="en">
        <body className={inter.className}>
          <LanguageProvider defaultTranslations={defaultTranslations}>
            <Toaster position="top-center" richColors />
            {children}
            <Analytics />
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-LLSSGYG1PT"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-LLSSGYG1PT');
              `}
            </Script>
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
