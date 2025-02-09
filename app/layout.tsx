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