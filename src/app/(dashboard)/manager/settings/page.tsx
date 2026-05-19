'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile, Settings } from '@/lib/types'
import TeamMembersTable from '@/components/manager/TeamMembersTable'
import InviteUserForm from '@/components/manager/InviteUserForm'
import DigestSettings from '@/components/manager/DigestSettings'
import toast from 'react-hot-toast'
import { Gear, Users } from 'phosphor-react'
import Header from '@/components/layout/Header'

export default function SettingsPage() {
  const [members, setMembers] = useState<Profile[]>([]); const [settings, setSettings] = useState<Settings | null>(null); const [isLoading, setIsLoading] = useState(true); const supabase = createClient()
  useEffect(() => {
    async function fetchData() {
      const { data: m } = await supabase.from('profiles').select('*').order('full_name'); if (m) setMembers(m)
      const { data: s } = await supabase.from('settings').select('*').single(); if (s) setSettings(s)
      setIsLoading(false)
    }
    fetchData()
  }, [supabase])

  const handlePromote = async (id: string) => {
    const { error } = await supabase.from('profiles').update({ role: 'manager' }).eq('id', id)
    if (error) toast.error(error.message); else { toast.success('Promoted'); setMembers(members.map(m => m.id === id ? { ...m, role: 'manager' } : m)) }
  }
  const handleRemove = async (id: string) => {
    if (!confirm('Remove user?')) return
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) toast.error(error.message); else { toast.success('Removed'); setMembers(members.filter(m => m.id !== id)) }
  }

  if (isLoading) return <div className="flex flex-col min-h-screen bg-background-cream"><Header subtitle="Settings" /><main className="flex-1 max-w-5xl w-full mx-auto p-8"><div className="h-64 bg-gray-200 animate-pulse rounded-xl" /></main></div>
  return (
    <div className="flex flex-col min-h-screen bg-background-cream"><Header subtitle="Settings" /><main className="flex-1 max-w-5xl w-full mx-auto p-8 space-y-12">
      <header className="flex items-center gap-3"><div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Gear size={24} weight="bold" /></div><div><h2 className="text-2xl font-bold">Admin Panel</h2><p className="text-text-secondary text-sm">Team and settings.</p></div></header>
      <section className="space-y-6"><div className="flex items-center gap-2 border-b border-border-gray pb-2"><Users size={20} className="text-text-secondary" /><h3 className="text-lg font-semibold">Team Management</h3></div>
        <TeamMembersTable members={members} onPromote={handlePromote} onRemove={handleRemove} /></section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><InviteUserForm /><DigestSettings settings={settings} /></div>
    </main></div>
  )
}
