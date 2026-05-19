import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { format, startOfToday } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

export async function POST(req: Request) {
  try {
    const { isTest } = await req.json().catch(() => ({}));

    // Respect digest settings unless this is a test
    if (!isTest) {
      const { data: settings } = await supabase
        .from("settings")
        .select("digest_enabled")
        .single();
      if (settings && !settings.digest_enabled) {
        return NextResponse.json({ message: "Digest is disabled" });
      }
    }

    const today = format(startOfToday(), "yyyy-MM-dd");
    const { data: managers } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("role", "manager");
    if (!managers || managers.length === 0)
      return NextResponse.json({ message: "No managers" });
    const { data: employees } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "employee");
    const { data: standups } = await supabase
      .from("standups")
      .select("*")
      .eq("date", today);
    const missing =
      employees?.filter((e) => !standups?.some((s) => s.user_id === e.id)) ||
      [];
    const subject = `StandupApp Daily Digest — ${format(startOfToday(), "MMM do, yyyy")}`;
    let html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;"><h1 style="color:#0d9488;">Daily Standup Digest</h1><p>${format(startOfToday(), "MMMM do, yyyy")}</p>`;
    if (standups && standups.length > 0) {
      standups.forEach((s) => {
        const e = employees?.find((emp) => emp.id === s.user_id);
        html += `<div style="margin-bottom:20px;padding:15px;border:1px solid #eee;"><h3>${e?.full_name} ${s.mood === "great" ? "😄" : s.mood === "good" ? "🙂" : s.mood === "meh" ? "😐" : "😔"}</h3><p><strong>Today:</strong><br/>${s.today}</p><p><strong>Tomorrow:</strong><br/>${s.tomorrow}</p></div>`;
      });
    } else html += `<p>No standups.</p>`;
    if (missing.length > 0)
      html += `<div style="margin-top:20px;border-top:1px solid #eee;"><p>Missing:</p><ul>${missing.map((e) => `<li>${e.full_name}</li>`).join("")}</ul></div>`;
    html += `</div>`;
    await Promise.all(
      managers.map((m) =>
        resend.emails.send({
          from: "StandupApp <onboarding@resend.dev>",
          to: [m.email],
          subject: isTest ? `[TEST] ${subject}` : subject,
          html,
        }),
      ),
    );
    return NextResponse.json({ message: "Sent" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
