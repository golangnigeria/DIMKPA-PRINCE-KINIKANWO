import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  const sessionToken = request.cookies.get("admin_session")?.value;

  if (!sessionToken && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (sessionToken && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/admin/:path*"],
};
