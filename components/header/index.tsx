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
            <span className="font-bold inline-block">Mochi</span>
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
                  href={tab.url}
                >
                  {tab.title}
                </Link>
              )
            ))}
          </nav>
        </div>
        <div className="flex-1" />
        <div className="flex items-center justify-between space-x-2">
          <nav className="flex items-center space-x-2">
            <LanguageSwitcher currentLocale={currentLocale} />
            {clerkUser ? (
              <User user={clerkUser} />
            ) : (
              <SignInButton mode="modal" afterSignInUrl={`/${currentLocale}/create`}>
                <Button variant="outline" size="sm">Sign In</Button>
              </SignInButton>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
