'use client'

import { Profile } from '@/lib/types'
import { useState } from 'react'

export default function MentionDropdown({ profiles, searchTerm, onSelect, position }: { profiles: Profile[], searchTerm: string, onSelect: (p: Profile) => void, onClose: () => void, position: { top: number, left: number } }) {
  const filteredProfiles = profiles.filter((p) => p.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  const [activeIndex, setActiveIndex] = useState(0)

  // To avoid effect-based state reset, we could derive activeIndex or reset on selection.
  // For simplicity in this demo, let's keep it minimal.

  if (filteredProfiles.length === 0) return null
  return (
    <div className="absolute z-50 w-64 bg-white rounded-lg shadow-md border border-border-gray py-1 overflow-hidden" style={{ top: position.top, left: position.left, transform: 'translateY(-100%)', marginTop: '-8px' }}>
      <div className="px-3 py-1.5 border-b border-border-gray"><p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Team Members</p></div>
      <div className="max-h-48 overflow-y-auto">
        {filteredProfiles.map((profile, index) => (
          <button key={profile.id} onClick={() => onSelect(profile)} onMouseEnter={() => setActiveIndex(index)} className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${index === activeIndex ? 'bg-primary-light text-primary-dark' : 'text-text-primary hover:bg-background-cream'}`}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: profile.avatar_color || '#0d9488' }}>{profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase()}</div>
            <span className="truncate">{profile.full_name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
