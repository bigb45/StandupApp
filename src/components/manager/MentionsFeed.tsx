'use client'

import { Profile } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { WarningCircle, ArrowSquareOut } from 'phosphor-react'

export default function MentionsFeed({ mentions, onOpenStandup }: { mentions: any[], onOpenStandup: (p: Profile, d: string) => void }) {
  return (
    <section className="space-y-6"><div className="flex items-center gap-2 border-b border-border-gray pb-2"><WarningCircle size={20} className="text-danger" /><h3 className="text-lg font-semibold text-text-primary">Team Mentions</h3></div>
      <div className="card p-0 overflow-hidden bg-white">{mentions.length > 0 ? <ul className="divide-y divide-border-gray">{mentions.map((m: any) => (
        <li key={m.id} className="p-4 hover:bg-background-cream transition-colors"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: m.mentioning_profile.avatar_color || '#9ca3af' }}>{m.mentioning_profile.full_name.split(' ').map((n: any) => n[0]).join('').toUpperCase()}</div><p className="text-sm"><strong>{m.mentioning_profile.full_name}</strong><span className="text-text-secondary mx-1">mentioned</span><strong className="text-primary">@{m.mentioned_profile.full_name}</strong><span className="text-text-secondary mx-1">on</span><strong>{format(parseISO(m.standups.date), 'MMM do')}</strong></p></div><button onClick={() => onOpenStandup(m.mentioning_profile, m.standups.date)} className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">View <ArrowSquareOut size={14} /></button></div></li>
      ))}</ul> : <div className="p-12 text-center text-sm text-text-secondary italic">No mentions.</div>}</div>
    </section>
  )
}
