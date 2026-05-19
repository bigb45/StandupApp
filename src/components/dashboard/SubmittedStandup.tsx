'use client'

import { Standup, Mood } from '@/lib/types'
import { CheckCircle, Sun, ArrowRight, WarningCircle, Smiley, SmileyMeh, SmileySad, SmileyWink, PencilSimple, IconProps } from 'phosphor-react'
import { format } from 'date-fns'
import FormattedText from '../ui/FormattedText'
import { ComponentType } from 'react'

const moodOptions: Record<Mood, { label: string, icon: ComponentType<IconProps> }> = {
  great: { label: 'Great', icon: SmileyWink },
  good: { label: 'Good', icon: Smiley },
  meh: { label: 'Meh', icon: SmileyMeh },
  struggling: { label: 'Struggling', icon: SmileySad },
}

export default function SubmittedStandup({ standup, onEdit }: { standup: Standup, onEdit: () => void }) {
  const currentDate = format(new Date(), 'EEEE, MMMM do')
  const moodInfo = standup.mood ? moodOptions[standup.mood] : null

  return (
    <div className="space-y-6">
      <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-success">
          <CheckCircle size={24} weight="fill" />
          <div>
            <p className="font-semibold text-sm">Standup submitted!</p>
            <p className="text-xs opacity-80">At {format(new Date(standup.submitted_at), 'h:mm a')}</p>
          </div>
        </div>
        <button onClick={onEdit} className="btn-secondary bg-white shadow-sm hover:shadow-md flex items-center gap-2 text-xs py-1.5 px-3">
          <PencilSimple size={16} /> Edit
        </button>
      </div>

      <div className="card w-full opacity-90">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-primary">{currentDate}</h2>
          {moodInfo && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light text-primary-dark text-xs font-medium">
              <moodInfo.icon size={16} weight="bold" /> {moodInfo.label}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary uppercase tracking-wider">
              <Sun size={18} className="text-primary" weight="bold" /> Today
            </h3>
            <p className="text-text-primary whitespace-pre-wrap text-sm leading-relaxed">{standup.today}</p>
          </div>
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary uppercase tracking-wider">
              <ArrowRight size={18} className="text-primary" weight="bold" /> Tomorrow
            </h3>
            <p className="text-text-primary whitespace-pre-wrap text-sm leading-relaxed">{standup.tomorrow}</p>
          </div>
          {standup.blockers && (
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary uppercase tracking-wider">
                <WarningCircle size={18} className="text-danger" weight="bold" /> Blockers
              </h3>
              <FormattedText text={standup.blockers} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
