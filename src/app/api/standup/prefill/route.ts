import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { user_email, date, today_items } = await req.json()
    const { data: profile } = await supabase.from('profiles').select('id').eq('email', user_email).single()
    if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const { error } = await supabase.from('standups').upsert({ user_id: profile.id, date, today: today_items.map((i: string) => `• ${i}`).join('\n') }, { onConflict: 'user_id, date' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ message: 'Pre-filled', redirect_url: '/dashboard' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
