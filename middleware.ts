import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return req.cookies.get(name)?.value; },
        set(name: string, value: string, options: any) { res.cookies.set({ name, value, ...options }); },
        remove(name: string, options: any) { res.cookies.set({ name, value: "", ...options }); }
      }
    }
  );

  const { data } = await supabase.auth.getUser();
  const url = req.nextUrl;
  const isAuthPage = url.pathname.startsWith("/login");
  const isPublic = isAuthPage || url.pathname.startsWith("/api/health");

  if (!data.user && !isPublic) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (data.user && isAuthPage) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
