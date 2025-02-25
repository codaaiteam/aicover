import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/contexts/language";
import { AppContextProvider } from "@/contexts/AppContext"; 
import defaultTranslations from "@/locales/en.json";
import Script from "next/script";
import { generateMetadata } from './metadata'

export { generateMetadata }

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
      afterSignUpUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
    >
      <html lang="en">
        <head>
          <meta name="google-site-verification" content="O_PEb7XrNO2XGoETepMtJp-a4LSDyuO2xi3N4H5zOu0" />
          <Script async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5451478429268021"
            crossorigin="anonymous"
            strategy="afterInteractive"
          />
        </head>
        <body className={inter.className}>
          <LanguageProvider defaultTranslations={defaultTranslations}>
            <AppContextProvider>
              <Toaster position="top-center" richColors />
              {children}
              <Analytics />
            </AppContextProvider>
          </LanguageProvider>
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
        </body>
      </html>
    </ClerkProvider>
  );
}