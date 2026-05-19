'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'phosphor-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    toast.success('Signed in successfully')

    if (profile?.role === 'manager') {
      router.push('/manager')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-cream p-4">
      <div className="card max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mb-3 shadow-sm">
            <CheckCircle size={32} weight="bold" />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">StandupApp</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="input-field w-full"
              placeholder="name@compunknown.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              className="input-field w-full"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full mt-6"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-xs text-text-secondary text-center mt-8">
          Account creation is managed by your team lead.
        </p>
      </div>
    </div>
  )
}
