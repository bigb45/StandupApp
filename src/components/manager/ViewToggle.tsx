'use client'

import { Calendar, SquaresFour } from 'phosphor-react'

export default function ViewToggle({ view, setView }: { view: 'calendar' | 'grid', setView: (v: 'calendar' | 'grid') => void }) {
  return (
    <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
      <button onClick={() => setView('calendar')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'}`}><Calendar size={18} /> Calendar</button>
      <button onClick={() => setView('grid')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'}`}><SquaresFour size={18} /> Grid</button>
    </div>
  )
}
