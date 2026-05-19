'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle, SignOut, CaretDown } from 'phosphor-react'
import { useState, useEffect } from 'react'
import { Profile } from '@/lib/types'
import toast from 'react-hot-toast'

export default function Header({ subtitle }: { subtitle?: string }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    getProfile()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    toast.success('Signed out')
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : '??'

  return (
    <header className="bg-surface border-b border-border-gray px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-sm">
          <CheckCircle size={20} weight="bold" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-text-primary leading-tight">StandupApp</h1>
          {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
        </div>
      </div>
      <div className="flex-1 flex justify-center hidden md:flex">
        {profile && <h2 className="text-lg font-medium text-text-primary">Good morning, {profile.full_name.split(' ')[0]} 👋</h2>}
      </div>
      <div className="relative">
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 hover:bg-background-cream p-1 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: profile?.avatar_color || '#0d9488' }}>{initials}</div>
          <CaretDown size={14} className={`text-text-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setIsDropdownOpen(false)}></div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-md border border-border-gray py-2 z-30">
              <div className="px-4 py-2 border-b border-border-gray mb-1">
                <p className="text-sm font-semibold text-text-primary truncate">{profile?.full_name}</p>
                <p className="text-xs text-text-secondary truncate">{profile?.email}</p>
              </div>
              <button onClick={handleSignOut} className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-background-cream flex items-center gap-2 transition-colors">
                <SignOut size={18} className="text-text-secondary" /> Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
