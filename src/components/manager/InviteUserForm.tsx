'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { UserPlus } from 'phosphor-react'

export default function InviteUserForm() {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [isLoading, setIsLoading] = useState(false); const supabase = createClient()
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: name, role: 'employee', avatar_color: '#' + Math.floor(Math.random()*16777215).toString(16) } } })
    if (error) toast.error(error.message); else { toast.success('Invite sent'); setName(''); setEmail('') }
    setIsLoading(false)
  }
  return (
    <div className="card h-full flex flex-col"><div className="flex items-center gap-2 mb-6"><UserPlus size={20} className="text-primary" weight="bold" /><h3 className="font-semibold text-text-primary">Invite Member</h3></div>
      <form onSubmit={handleInvite} className="space-y-4 flex-1 flex flex-col"><div className="space-y-1"><label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Name</label><input type="text" className="input-field w-full text-sm" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Email</label><input type="email" className="input-field w-full text-sm" placeholder="jane@compunknown.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div className="flex-1" /><button type="submit" disabled={isLoading} className="btn-primary w-full">{isLoading ? 'Sending...' : 'Send Invitation'}</button></form></div>
  )
}
