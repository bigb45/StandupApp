'use client'

import { Mood, Profile } from '@/lib/types'
import { Sun, ArrowRight, WarningCircle, PaperPlaneTilt, Smiley, SmileyMeh, SmileySad, SmileyWink, IconProps } from 'phosphor-react'
import { format } from 'date-fns'
import { useState, useRef, useEffect, ComponentType } from 'react'
import MentionDropdown from './MentionDropdown'
import { createClient } from '@/lib/supabase/client'

const moodOptions: { value: Mood; label: string; icon: ComponentType<IconProps> }[] = [
  { value: 'great', label: 'Great', icon: SmileyWink },
  { value: 'good', label: 'Good', icon: Smiley },
  { value: 'meh', label: 'Meh', icon: SmileyMeh },
  { value: 'struggling', label: 'Struggling', icon: SmileySad },
]

export default function StandupForm({ today, tomorrow, blockers, mood, setToday, setTomorrow, setBlockers, setMood, onSubmit, isSubmitting, isEditMode = false }: { today: string, tomorrow: string, blockers: string, mood: Mood | null, setToday: (v: string) => void, setTomorrow: (v: string) => void, setBlockers: (v: string) => void, setMood: (v: Mood) => void, onSubmit: (e: React.FormEvent) => void, isSubmitting: boolean, isEditMode?: boolean }) {
  const currentDate = format(new Date(), 'EEEE, MMMM do')
  const [showMentions, setShowMentions] = useState(false)
  const [mentionSearch, setMentionSearch] = useState('')
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
  const [profiles, setProfiles] = useState<Profile[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await supabase.from('profiles').select('*').order('full_name')
      if (data) setProfiles(data)
    }
    fetchProfiles()
  }, [supabase])

  const handleBlockersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const cursorPosition = e.target.selectionStart || 0
    setBlockers(value)
    const lastAtSymbol = value.lastIndexOf('@', cursorPosition - 1)
    if (lastAtSymbol !== -1 && !value.slice(lastAtSymbol, cursorPosition).includes(' ')) {
      setMentionSearch(value.slice(lastAtSymbol + 1, cursorPosition))
      setShowMentions(true)
      if (textareaRef.current) setMentionPosition({ top: textareaRef.current.offsetTop, left: textareaRef.current.offsetLeft + 20 })
    } else setShowMentions(false)
  }

  const handleMentionSelect = (profile: Profile) => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart || 0
      const lastAtSymbol = blockers.lastIndexOf('@', cursorPosition - 1)
      setBlockers(blockers.slice(0, lastAtSymbol) + `@${profile.full_name} ` + blockers.slice(cursorPosition))
      setShowMentions(false)
      textareaRef.current.focus()
    }
  }

  return (
    <div className="card w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-text-primary">{currentDate}</h2>
        {isEditMode && <span className="text-xs font-medium text-primary bg-primary-light px-2 py-1 rounded-full uppercase tracking-wider">Editing</span>}
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-text-primary"><Sun size={18} className="text-primary" weight="bold" /> Today</label>
        <textarea className="input-field w-full min-h-[100px] resize-none" value={today} onChange={(e) => setToday(e.target.value)} required /></div>
        <div className="space-y-2"><label className="flex items-center gap-2 text-sm font-semibold text-text-primary"><ArrowRight size={18} className="text-primary" weight="bold" /> Tomorrow</label>
        <textarea className="input-field w-full min-h-[100px] resize-none" value={tomorrow} onChange={(e) => setTomorrow(e.target.value)} required /></div>
        <div className="space-y-2 relative"><label className="flex items-center gap-2 text-sm font-semibold text-text-primary"><WarningCircle size={18} className="text-danger" weight="bold" /> Blockers</label>
        <textarea ref={textareaRef} className="input-field w-full min-h-[100px] resize-none" value={blockers} onChange={handleBlockersChange} />
        {showMentions && <MentionDropdown profiles={profiles} searchTerm={mentionSearch} onSelect={handleMentionSelect} onClose={() => setShowMentions(false)} position={mentionPosition} />}</div>
        <div className="space-y-3"><label className="text-sm font-semibold text-text-primary block">Mood</label><div className="flex flex-wrap gap-2">
          {moodOptions.map((o) => {
            const Icon = o.icon
            return (
              <button key={o.value} type="button" onClick={() => setMood(o.value)} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium ${mood === o.value ? 'bg-primary-light border-primary text-primary-dark' : 'bg-white border-border-gray text-text-secondary hover:border-primary/50'}`}>
                <Icon size={18} weight={mood === o.value ? 'bold' : 'regular'} /> {o.label}
              </button>
            )
          })}
        </div></div>
        <button type="submit" disabled={isSubmitting || !mood} className="btn-primary w-full mt-4 h-12">{isSubmitting ? 'Submitting...' : <><PaperPlaneTilt size={20} weight="bold" /> {isEditMode ? 'Update' : 'Submit'}</>}</button>
      </form>
    </div>
  )
}
