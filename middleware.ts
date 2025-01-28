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
  "/(.*)/sign-in(.*)",
  "/(.*)/sign-up(.*)",
  "/(.*)/guide",
  "/(.*)/create",
  "/_next(.*)",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

export default authMiddleware({
  publicRoutes,
  beforeAuth: (req) => {
    const pathname = req.nextUrl.pathname;

    // 如果路径已经包含语言前缀，直接继续
    if (validLanguages.some(lang => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`)) {
      return NextResponse.next();
    }

    // 如果是 API 路由，直接继续
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // 获取用户语言
    const lang = getLanguage(req);

    // 创建新的 URL 并添加语言前缀
    const newUrl = new URL(`/${lang}${pathname}`, req.url);
    newUrl.search = req.nextUrl.search;

    return NextResponse.redirect(newUrl);
  },
  afterAuth: (auth, req) => {
    const pathname = req.nextUrl.pathname;
    
    // 检查是否是需要认证的路由
    if (!auth.userId && !publicRoutes.some(pattern => {
      const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
      return regex.test(pathname);
    })) {
      const lang = getLanguage(req);
      return NextResponse.redirect(new URL(`/${lang}/sign-in`, req.url));
    }
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
