'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'phosphor-react';
import toast from 'react-hot-toast';

export default function SetupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkUsers() {
      try {
        const res = await fetch('/api/setup/check');
        const data = await res.json();
        if (data.hasUsers) {
          router.replace('/login');
        } else {
          setIsChecking(false);
        }
      } catch {
        setIsChecking(false);
      }
    }
    checkUsers();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch('/api/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || 'Setup failed');
      setIsLoading(false);
      return;
    }

    toast.success('Manager account created! Please sign in.');
    router.push('/login');
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-cream">
        <div className="text-text-secondary text-sm">Checking setup...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-cream p-4">
      <div className="card max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mb-3 shadow-sm">
            <CheckCircle size={32} weight="bold" />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">StandupApp</h1>
          <p className="text-sm text-text-secondary mt-1">First-time setup</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="input-field w-full"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="input-field w-full"
              placeholder="manager@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-field w-full"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full mt-6">
            {isLoading ? 'Creating account...' : 'Create Manager Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
