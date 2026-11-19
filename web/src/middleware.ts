import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canonicalPathname } from "@/lib/localized-paths";

export function middleware(request: NextRequest) {
  const canonical = canonicalPathname(request.nextUrl.pathname);
  if (canonical === request.nextUrl.pathname) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = canonical;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api|panel|assets|favicon.ico|.*\\..*).*)"],
};
