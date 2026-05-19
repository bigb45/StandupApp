'use client'

import { Profile, Standup, Mood } from '@/lib/types'
import { X, Sun, ArrowRight, WarningCircle, Smiley, SmileyMeh, SmileySad, SmileyWink, CaretLeft, IconProps } from 'phosphor-react'
import { format, parseISO } from 'date-fns'
import FormattedText from '../ui/FormattedText'
import { ComponentType } from 'react'

const moodOptions: Record<Mood, { label: string, icon: ComponentType<IconProps> }> = { great: { label: 'Great', icon: SmileyWink }, good: { label: 'Good', icon: Smiley }, meh: { label: 'Meh', icon: SmileyMeh }, struggling: { label: 'Struggling', icon: SmileySad } }

export default function SlideOver({ isOpen, onClose, profile, standup, date }: { isOpen: boolean, onClose: () => void, profile: Profile | null, standup: Standup | null, date: string | null }) {
  if (!isOpen || !profile || !date) return null
  const moodInfo = standup?.mood ? moodOptions[standup.mood] : null
  return (
    <><div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-surface shadow-2xl z-50 flex flex-col"><div className="px-6 py-4 border-b flex items-center justify-between"><button onClick={onClose} className="flex items-center gap-1 text-text-secondary text-sm font-medium"><CaretLeft size={18} /> Back</button><button onClick={onClose} className="p-1"><X size={20} /></button></div>
      <div className="flex-1 overflow-y-auto p-8 space-y-10"><header className="flex items-center gap-4"><div className="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: profile.avatar_color || '#9ca3af' }}>{profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase()}</div><div><h2 className="text-2xl font-bold">{profile.full_name}</h2><p className="text-text-secondary font-medium">{format(parseISO(date), 'EEEE, MMMM do')}</p></div></header>
        {standup ? <div className="space-y-10">{moodInfo && <div className="space-y-3"><p className="text-xs font-bold uppercase text-text-secondary">Mood</p><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary-dark font-semibold"><moodInfo.icon size={20} /> {moodInfo.label}</div></div>}
          <div className="space-y-4"><h3 className="flex items-center gap-2 text-sm font-bold uppercase"><Sun size={20} className="text-primary" /> Today</h3><p className="whitespace-pre-wrap leading-relaxed">{standup.today}</p></div>
          <div className="space-y-4"><h3 className="flex items-center gap-2 text-sm font-bold uppercase"><ArrowRight size={20} className="text-primary" /> Tomorrow</h3><p className="whitespace-pre-wrap leading-relaxed">{standup.tomorrow}</p></div>
          {standup.blockers && <div className="space-y-4"><h3 className="flex items-center gap-2 text-sm font-bold uppercase"><WarningCircle size={20} className="text-danger" /> Blockers</h3><FormattedText text={standup.blockers} /></div>}
        </div> : <div className="bg-gray-50 border-2 border-dashed rounded-xl p-12 text-center text-text-secondary italic">No standup submitted.</div>}
      </div></div></>
  )
}
