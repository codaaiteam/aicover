import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const validLanguages = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it'];

function getLanguage(request: NextRequest) {
  const languageCookie = request.cookies.get('NEXT_LOCALE');
  if (languageCookie && validLanguages.includes(languageCookie.value)) {
    return languageCookie.value;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLanguage = acceptLanguage
      .split(',')[0]
      .split('-')[0]
      .toLowerCase();
    
    if (validLanguages.includes(preferredLanguage)) {
      return preferredLanguage;
    }
  }

  return 'en';
}

const publicRoutes = [
  "/",
  "/sign-in(.*)",  // 默认登录路径
  "/(en|zh|ja|ko|es|fr|de|it)/sign-in(.*)",  // 带语言前缀的登录路径
  "/sign-up(.*)",  // 默认注册路径
  "/(en|zh|ja|ko|es|fr|de|it)/sign-up(.*)",  // 带语言前缀的注册路径
  "/sign-in/authorize",  // OAuth 授权路径
  "/sign-up/authorize",  // OAuth 授权路径
  "/(en|zh|ja|ko|es|fr|de|it)/sign-in/authorize",  // 带语言前缀的 OAuth 授权路径
  "/(en|zh|ja|ko|es|fr|de|it)/sign-up/authorize",  // 带语言前缀的 OAuth 授权路径
  "/(.*)/guide",
  "/(.*)/create",
  "/(.*)/pricing",
  "/api/(.*)",
  "/(en|zh|ja|ko|es|fr|de|it)$", // 语言根路径
  "/(en|zh|ja|ko|es|fr|de|it)/$", // 语言根路径（带斜杠）
  "/_next(.*)",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/oauth/callback/(.*)",  // OAuth 回调路径
  "/v1/oauth_callback",    // Clerk OAuth 回调路径
  "/privacy(.*)",
  "/(en|zh|ja|ko|es|fr|de|it)/privacy(.*)",
  "/terms(.*)",
  "/(en|zh|ja|ko|es|fr|de|it)/terms(.*)",
];

export default authMiddleware({
  publicRoutes,
  beforeAuth: (req) => {
    const url = req.nextUrl;
    const pathname = url.pathname;

    // 添加路径信息到请求头
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', pathname);

    // 如果路径已经包含语言前缀，直接继续
    if (validLanguages.some(lang => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`)) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // 如果是 API 路由，直接继续
    if (pathname.startsWith('/api/')) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // 获取用户语言
    const lang = getLanguage(req);

    // 创建新的 URL 并添加语言前缀
    const newUrl = new URL(`/${lang}${pathname}`, req.url);
    newUrl.search = req.nextUrl.search;

    return NextResponse.redirect(newUrl);
  },
  afterAuth: (auth, req) => {
    // 不再做自动跳转，只返回 next
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
