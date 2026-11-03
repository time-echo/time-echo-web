import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/check_email",
  "/about",
  "/terms",
  "/privacy",
  "/letters/success",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (publicPath) =>
      pathname === publicPath ||
      (publicPath !== "/" && pathname.startsWith(`${publicPath}/`)),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("timeecho_session_token")?.value;

  if (!isPublicPath(pathname) && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const cookieLocale =
    request.cookies.get("timeecho_locale")?.value ||
    request.cookies.get("NEXT_LOCALE")?.value;

  let locale = "es";
  if (cookieLocale === "en" || cookieLocale === "es") {
    locale = cookieLocale;
  } else {
    const acceptLanguage = request.headers.get("accept-language") || "";
    if (acceptLanguage.toLowerCase().startsWith("en")) {
      locale = "en";
    }
  }

  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  response.headers.set("x-locale", locale);

  if (!request.cookies.has("timeecho_locale")) {
    response.cookies.set("timeecho_locale", locale, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-touch-icon.png|.*\\..*).*)",
  ],
};
