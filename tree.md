.
├── DEPLOY.md
├── LICENSE
├── Makefile
├── README.md
├── README_CN.md
├── app
│   ├── (auth)
│   │   ├── pay-success
│   │   │   └── [session_id]
│   │   │       └── page.tsx
│   │   ├── sign-in
│   │   │   └── [[...sign-in]]
│   │   │       └── page.tsx
│   │   └── sign-up
│   │       └── [[...sign-up]]
│   │           └── page.tsx
│   ├── (landing)
│   │   ├── data
│   │   │   └── videoData.ts
│   │   ├── guide
│   │   │   ├── page.module.css
│   │   │   └── page.tsx
│   │   ├── page.module.css
│   │   └── page.tsx
│   ├── [lang]
│   │   ├── create
│   │   │   ├── layout.tsx
│   │   │   ├── page.module.css
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── guide
│   │   │   ├── page.module.css
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── price
│   │   │   └── page.tsx
│   │   ├── privacy
│   │   │   └── page.tsx
│   │   ├── sign-in
│   │   │   └── [[...sign-in]]
│   │   │       └── page.tsx
│   │   ├── sign-up
│   │   │   └── page.tsx
│   │   ├── terms
│   │   │   └── page.tsx
│   │   └── videos
│   │       └── page.tsx
│   ├── api
│   │   ├── checkout
│   │   │   └── route.ts
│   │   ├── gen-cover
│   │   │   └── route.ts
│   │   ├── get-covers
│   │   │   └── route.ts
│   │   ├── get-user-info
│   │   │   └── route.ts
│   │   ├── orders
│   │   │   └── route.ts
│   │   ├── user
│   │   │   └── credits
│   │   │       └── route.ts
│   │   ├── videos
│   │   │   ├── public
│   │   │   │   └── route.ts
│   │   │   └── recent
│   │   │       └── route.ts
│   │   └── webhook
│   │       └── route.ts
│   ├── contexts
│   │   └── AppContext.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components
│   ├── covers
│   │   └── index.tsx
│   ├── footer
│   │   └── index.tsx
│   ├── header
│   │   ├── header.module.css
│   │   └── index.tsx
│   ├── hero
│   │   └── index.tsx
│   ├── input
│   │   └── index.tsx
│   ├── landing
│   │   ├── FeatureCard.module.css
│   │   ├── GuidePage.module.css
│   │   ├── LanguageSwitcher.module.css
│   │   ├── NavBar.module.css
│   │   ├── Step.module.css
│   │   ├── UserReview.module.css
│   │   ├── VideoCardGrid.module.css
│   │   ├── feature-card.module.css
│   │   ├── feature-card.tsx
│   │   ├── footer.tsx
│   │   ├── language-switcher.tsx
│   │   ├── navbar.tsx
│   │   ├── page.module.css
│   │   ├── question-faq.module.css
│   │   ├── question-faq.tsx
│   │   ├── questionfaq.module.css
│   │   └── video-card-grid.tsx
│   ├── social
│   │   └── index.tsx
│   ├── ui
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   └── textarea.tsx
│   └── user
│       └── index.tsx
├── components.json
├── contexts
│   ├── AppContext.tsx
│   ├── GenerationContext.tsx
│   └── language.tsx
├── data
│   ├── install.sql
│   └── videoData.js
├── db
│   ├── migrate.js
│   ├── migrate.ts
│   ├── migrations
│   │   ├── 001_init.sql
│   │   └── 001_init_d1.sql
│   └── seed.js
├── debug
│   └── apitest.http
├── deployment.md
├── lib
│   ├── index.ts
│   ├── order.ts
│   ├── resp.ts
│   ├── s3.ts
│   ├── supabase.ts
│   └── utils.ts
├── locales
│   ├── de.json
│   ├── en.json
│   ├── es.json
│   ├── fr.json
│   ├── it.json
│   ├── ja.json
│   ├── ko.json
│   ├── lang.py
│   ├── zh-cn.json
│   ├── zh-tw.json
│   └── zh.json
├── middleware.ts
├── models
│   ├── cover.ts
│   ├── db.ts
│   ├── order.ts
│   └── user.ts
├── netlify
│   └── functions
├── netlify.toml
├── next-env.d.ts
├── next.config.js
├── next.config.mjs
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── preview.png
├── public
│   ├── auth-01.png
│   ├── auth-02.png
│   ├── auth-03.png
│   ├── favicon.ico
│   ├── hb_bottom.png
│   ├── hero-image.gif
│   ├── icon-ai-production.svg
│   ├── icon-effortless.svg
│   ├── icon-generate.svg
│   ├── icon-input.svg
│   ├── icon-multi-language.svg
│   ├── icon-realistic.svg
│   ├── icon-share.svg
│   ├── icon-text-to-video.svg
│   ├── icon-time-saving.svg
│   ├── logo.png
│   ├── next.svg
│   ├── og-image.png
│   ├── rural-village.gif
│   ├── sitemap.xml
│   ├── sky-kingdom.gif
│   ├── street-market.gif
│   ├── twitter-image.png
│   └── vercel.svg
├── schema.sql
├── scripts
│   └── migrate-prod.js
├── services
│   ├── fal.ts
│   ├── openai.ts
│   ├── order.ts
│   ├── r2.ts
│   └── user.ts
├── src
│   └── lib
│       └── api.ts
├── supabase
│   └── migrations
│       ├── 001_init.sql
│       └── 20240128_init.sql
├── tailwind.config.ts
├── test-supabase.ts
├── test_supabse.js
├── tree.md
├── tsconfig.json
├── types
│   ├── api.ts
│   ├── context.d.ts
│   ├── cover.d.ts
│   ├── cover.ts
│   ├── nav.d.ts
│   ├── nav.ts
│   ├── order.d.ts
│   ├── order.ts
│   ├── supabase.ts
│   ├── user.d.ts
│   └── user.ts
└── vercel.json

64 directories, 171 files
