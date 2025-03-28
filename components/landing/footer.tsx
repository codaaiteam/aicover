'use client'

import { useLanguage } from "@/contexts/language"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://mochi1preview.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Mochi 1 Preview
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/genmoai/mochi"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
        <span>·</span>
        <a href="https://www.4oimagegeneration.net" target="_blank" rel="noopener noreferrer">
        Gpt 4o Image Generation
        </a>
        <span>·</span>
        <a href="https://www.4oimagegeneration.net" target="_blank" rel="noopener noreferrer">
        Gpt 4o Image Generation
        </a>
        <span>·</span>
        <a href="https://www.4oimagegeneration.net" target="_blank" rel="noopener noreferrer">
        Gpt 4o Image Generation
        </a>
        <span>·</span>
        <a href="https://www.4oimagegeneration.net" target="_blank" rel="noopener noreferrer">
        Gpt 4o Image Generation
        </a>


    </footer>
  )
}
