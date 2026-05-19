'use client'

import { Profile } from '@/lib/types'
import { format } from 'date-fns'

export default function TeamSummaryStrip({ totalEmployees, submittedCount, nonSubmitters }: { totalEmployees: number, submittedCount: number, nonSubmitters: Profile[] }) {
  const percentage = totalEmployees > 0 ? (submittedCount / totalEmployees) * 100 : 0
  return (
    <div className="card mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1"><p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Today&apos;s Progress</p><h2 className="text-xl font-semibold text-text-primary">{format(new Date(), 'EEEE, MMMM do')}</h2></div>
        <div className="flex-1 max-w-md"><div className="flex justify-between items-end mb-2"><p className="text-sm font-medium text-text-primary"><span className="text-primary font-bold">{submittedCount}</span><span className="text-text-secondary"> / {totalEmployees} submitted</span></p><p className="text-xs font-bold text-primary">{Math.round(percentage)}%</p></div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-primary transition-all duration-500" style={{ width: `${percentage}%` }} /></div></div>
        <div className="space-y-2"><p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Awaiting</p><div className="flex -space-x-2 overflow-hidden">{nonSubmitters.length > 0 ? nonSubmitters.map((p) => <div key={p.id} title={p.full_name} className="h-8 w-8 rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: p.avatar_color || '#9ca3af' }}>{p.full_name.split(' ').map((n) => n[0]).join('').toUpperCase()}</div>) : <p className="text-xs text-success font-medium italic">All set! 🎉</p>}</div></div>
      </div>
    </div>
  )
}
