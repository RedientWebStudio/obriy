import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

/**
 * Legacy bilingual prefixes → unprefixed Ukrainian URLs.
 * `/studio` bypasses next-intl (standalone Studio redirect shell).
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/studio" || pathname.startsWith("/studio/")) {
    return NextResponse.next();
  }

  if (pathname === "/uk" || pathname === "/en") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith("/uk/") || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/(uk|en)/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/",
    "/(uk|en)/:path*",
    "/studio",
    "/studio/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
