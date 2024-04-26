import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // твоя httpOnly кука

  const { pathname } = req.nextUrl;

  const isPublic = pathname.startsWith("/login") || pathname.startsWith("/register");

  // Если нет токена и страница защищённая — редиректим
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Если токен есть, а пользователь на /login — редиректим на главную
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
    
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // защищаем все страницы кроме API и статики
  ],
};
