import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/sign-in", "/sign-up", "/forget-password"];
  const isPublic = publicRoutes.includes(pathname);

  const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true";

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
