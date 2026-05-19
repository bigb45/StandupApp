'use client'

import { Plus } from 'phosphor-react'
import { format, parseISO } from 'date-fns'

export default function GhostStandupCard({ date, onFill }: { date: string, onFill: (d: string) => void }) {
  return (
    <div className="card p-0 overflow-hidden mb-4 border-dashed border-2 border-border-gray bg-transparent shadow-none hover:border-primary/30 transition-colors">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4"><div className="text-sm font-semibold text-text-secondary opacity-60">{format(parseISO(date), 'MMM do, yyyy')}</div><div className="px-2 py-0.5 rounded-full bg-gray-100 text-text-secondary text-[10px] font-bold uppercase tracking-wider">Missing</div></div>
        <button onClick={() => onFill(date)} className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"><Plus size={16} weight="bold" /> Fill in</button>
      </div>
    </div>
  )
}
