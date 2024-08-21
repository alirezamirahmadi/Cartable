import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  // Add a new header x-current-path which passes the path to downstream components
  const requestHeaders = new Headers(request.headers);

  const currentPath = request.nextUrl.pathname;
  requestHeaders.set("x-current-path", currentPath);

  const secret = new TextEncoder().encode(process.env.privateKey);
  const token = cookies().get("token")?.value;
  const isLoggedin = token ? await jwtVerify(token, secret) : null

  // checkPermission("");
  // is logged in
  if (!isLoggedin && currentPath !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  else if (isLoggedin && currentPath === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // have route permission

  return NextResponse.next({ headers: requestHeaders });
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    "/((?!api|_next/static|_next/image|favicon.ico|svg).*)",
  ],
};

// const checkPermission = async (route: string) => {
//   await fetch (`api/v1/auth/permission`)
// }