import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function GET() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .limit(1);

  if (error) {
    return NextResponse.json({ hasUsers: false });
  }

  return NextResponse.json({ hasUsers: (data?.length ?? 0) > 0 });
}
