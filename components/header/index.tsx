'use client'

import { AppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Nav } from "@/types/nav";
import Social from "@/components/social";
import User from "@/components/user";
import { useContext } from "react";
import { useLanguage } from "@/contexts/language";
import LanguageSwitcher from "@/components/landing/language-switcher";
import { useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Coins, Crown } from "lucide-react";

export function Header() {
  const { user } = useContext(AppContext);
  const { t, currentLocale } = useLanguage();
  const { user: clerkUser } = useUser();

  const navigations: Nav[] = [
    { name: "home", title: t.home, url: `/${currentLocale}`, target: "_self" },
    { name: "create", title: t.create || "Create", url: `/${currentLocale}/create`, target: "_self" },
    { name: "guide", title: t.guide, url: `/${currentLocale}/guide`, target: "_self" },
    { name: "github", title: "GitHub", url: "https://github.com/codeium/mochi", target: "_blank" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href={`/${currentLocale}`} className="mr-6 flex items-center space-x-2">
            <img
              src="/logo.png"
              className="h-6 w-6"
              alt="Mochi Logo"
            />
            <span className="font-bold inline-block">Mochi 1 Preview Generator</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigations.map((tab: Nav, idx: number) => (
              tab.target === "_blank" ? (
                <a
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                  key={idx}
                  href={tab.url}
                  target={tab.target}
                  rel="noopener noreferrer"
                >
                  {tab.title}
                </a>
              ) : (
                <Link
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                  key={idx}
                  href={tab.url || '#'}
                >
                  {tab.title}
                </Link>
              )
            ))}
          </nav>
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          {clerkUser && (
            <>
              <div className="flex items-center space-x-2 text-sm">
                <Coins className="h-4 w-4" />
                <span>{t.creditsLeft || "2 credits left"}</span>
              </div>
              <Link href={`/${currentLocale}/price`}>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span>{t.upgrade || "Upgrade"}</span>
                </Button>
              </Link>
            </>
          )}
          <LanguageSwitcher currentLocale={currentLocale} />
          {clerkUser ? (
            <User />
          ) : (
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                {t.signIn || "Sign In"}
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
