import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // One-time setup redirect: if no users exist and hitting login/root, go to setup
  if (url.pathname === "/login" || url.pathname === "/") {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      },
    );
    const { data } = await supabase.from("profiles").select("id").limit(1);

    if (!data || data.length === 0) {
      url.pathname = "/setup";
      return NextResponse.redirect(url);
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
