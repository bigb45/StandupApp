'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile, Standup } from '@/lib/types'
import TeamSummaryStrip from '@/components/manager/TeamSummaryStrip'
import ViewToggle from '@/components/manager/ViewToggle'
import CalendarView from '@/components/manager/CalendarView'
import GridView from '@/components/manager/GridView'
import SlideOver from '@/components/manager/SlideOver'
import MentionsFeed from '@/components/manager/MentionsFeed'
import { format, startOfToday, subDays } from 'date-fns'

export default function ManagerDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]); const [standups, setStandups] = useState<Standup[]>([]); const [mentions, setMentions] = useState<unknown[]>([])
  const [view, setView] = useState<'calendar' | 'grid'>('calendar'); const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null); const [selectedDate, setSelectedDate] = useState<string | null>(null); const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient(); const today = format(startOfToday(), 'yyyy-MM-dd')

  useEffect(() => {
    async function fetchData() {
      const { data: p } = await supabase.from('profiles').select('*').eq('role', 'employee').order('full_name'); if (p) setProfiles(p)
      const { data: s } = await supabase.from('standups').select('*').gte('date', format(subDays(new Date(), 30), 'yyyy-MM-dd')); if (s) setStandups(s)
      const { data: m } = await supabase.from('mentions').select('id, created_at, standups(id, date), mentioning_profile:profiles!mentioning_user_id(id, full_name, avatar_color), mentioned_profile:profiles!mentioned_user_id(id, full_name)').order('created_at', { ascending: false }).limit(10); if (m) setMentions(m)
      setIsLoading(false)
    }
    fetchData()
  }, [supabase])

  const todayStandups = standups.filter(s => s.date === today)
  const handleSelect = (p: Profile, d: string) => { setSelectedUser(p); setSelectedDate(d); setIsOpen(true) }
  if (isLoading) return <div className="space-y-6"><div className="h-32 bg-gray-200 animate-pulse rounded-xl" /><div className="h-96 bg-gray-200 animate-pulse rounded-xl" /></div>

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <TeamSummaryStrip totalEmployees={profiles.length} submittedCount={todayStandups.length} nonSubmitters={profiles.filter(p => !todayStandups.some(s => s.user_id === p.id))} />
      <div className="flex justify-end"><ViewToggle view={view} setView={setView} /></div>
      {view === 'calendar' ? <CalendarView profiles={profiles} standups={standups} onSelectUser={handleSelect} /> : <GridView profiles={profiles} standups={standups} onSelectUser={handleSelect} />}
      <SlideOver isOpen={isOpen} onClose={() => setIsOpen(false)} profile={selectedUser} date={selectedDate} standup={selectedUser && selectedDate ? standups.find(s => s.user_id === selectedUser.id && s.date === selectedDate) || null : null} />
      <MentionsFeed mentions={mentions} onOpenStandup={handleSelect} />
    </div>
  )
}
