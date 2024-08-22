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

  // is logged in
  if (!isLoggedin && currentPath !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  else if (isLoggedin && currentPath === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (currentPath === "/" || "/login") {
    return NextResponse.next({ headers: requestHeaders })
  }
  
  // has route permission
  return await checkPermission(currentPath, isLoggedin?.payload?.username).then(res => res)
    ?
    NextResponse.next({ headers: requestHeaders })
    :
    NextResponse.redirect(new URL("/", request.url))
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.png|svg).*)",
  ],
};

const checkPermission = async (route: string, username: any) => {
  let isPermission = false;
  await fetch(`http:/localhost:3000/api/v1/auth/permission?title=${route}&username=${username}`)
    .then(res => isPermission = res.status === 200)
  return isPermission;
}