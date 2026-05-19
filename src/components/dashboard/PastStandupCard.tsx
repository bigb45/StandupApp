'use client'

import { Standup, Mood } from '@/lib/types'
import { CaretDown, Smiley, SmileyMeh, SmileySad, SmileyWink, Sun, ArrowRight, WarningCircle, IconProps } from 'phosphor-react'
import { format, parseISO } from 'date-fns'
import { useState, ComponentType } from 'react'
import FormattedText from '../ui/FormattedText'

const moodOptions: Record<Mood, { label: string, icon: ComponentType<IconProps> }> = {
  great: { label: 'Great', icon: SmileyWink },
  good: { label: 'Good', icon: Smiley },
  meh: { label: 'Meh', icon: SmileyMeh },
  struggling: { label: 'Struggling', icon: SmileySad },
}

export default function PastStandupCard({ standup }: { standup: Standup }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const date = parseISO(standup.date)
  const moodInfo = standup.mood ? moodOptions[standup.mood] : null
  return (
    <div className="card p-0 overflow-hidden mb-4 transition-all duration-200">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-background-cream transition-colors">
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-text-primary">{format(date, 'MMM do, yyyy')}</div>
          {moodInfo && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-light text-primary-dark text-[10px] font-bold uppercase tracking-wider">
              <moodInfo.icon size={12} weight="bold" /> {moodInfo.label}
            </div>
          )}
          {standup.is_late && <div className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-bold uppercase tracking-wider">Late</div>}
        </div>
        <CaretDown size={18} className={`text-text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      {isExpanded && (
        <div className="px-6 py-6 border-t border-border-gray bg-white space-y-6 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><h4 className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest"><Sun size={14} className="text-primary" weight="bold" /> Today</h4><p className="text-sm text-text-primary whitespace-pre-wrap">{standup.today}</p></div>
            <div className="space-y-2"><h4 className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest"><ArrowRight size={14} className="text-primary" weight="bold" /> Tomorrow</h4><p className="text-sm text-text-primary whitespace-pre-wrap">{standup.tomorrow}</p></div>
          </div>
          {standup.blockers && <div className="space-y-2"><h4 className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest"><WarningCircle size={14} className="text-danger" weight="bold" /> Blockers</h4><FormattedText text={standup.blockers} /></div>}
          <div className="pt-2 flex justify-end"><p className="text-[10px] text-text-secondary italic">Submitted on {format(new Date(standup.submitted_at), 'MMM do, yyyy h:mm a')}</p></div>
        </div>
      )}
    </div>
  )
}
