import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function middleware(req: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && req.nextUrl.pathname.startsWith("/Dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Dashboard/:path*"],
};
