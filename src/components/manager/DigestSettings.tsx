'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { EnvelopeSimple, PaperPlaneTilt } from 'phosphor-react'
import { Settings } from '@/lib/types'

export default function DigestSettings({ settings: initialSettings }: { settings: Settings | null }) {
  const [enabled, setEnabled] = useState(initialSettings?.digest_enabled ?? true); const [time, setTime] = useState(initialSettings?.digest_time ?? '08:00'); const [isSaving, setIsSaving] = useState(false); const [isTesting, setIsTesting] = useState(false); const supabase = createClient()
  const handleSave = async () => {
    setIsSaving(true); const { error } = await supabase.from('settings').update({ digest_enabled: enabled, digest_time: time }).eq('id', initialSettings?.id)
    if (error) toast.error(error.message); else toast.success('Saved'); setIsSaving(false)
  }
  const handleTest = async () => {
    setIsTesting(true); try { const res = await fetch('/api/send-digest', { method: 'POST', body: JSON.stringify({ isTest: true }) }); if (res.ok) toast.success('Sent'); else toast.error('Failed') } catch { toast.error('Error') } setIsTesting(false)
  }
  return (
    <div className="card h-full flex flex-col"><div className="flex items-center gap-2 mb-6"><EnvelopeSimple size={20} className="text-primary" weight="bold" /><h3 className="font-semibold text-text-primary">Daily Digest</h3></div>
      <div className="space-y-6 flex-1 flex flex-col"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Enable Digest</p><p className="text-xs text-text-secondary">Summary to managers.</p></div>
          <button onClick={() => setEnabled(!enabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-gray-200'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${enabled ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
        <div className="space-y-2"><label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Time</label><input type="time" className="input-field w-full text-sm" value={time} onChange={(e) => setTime(e.target.value)} disabled={!enabled} /></div>
        <div className="flex-1" /><div className="space-y-3 pt-4 border-t"><button onClick={handleSave} disabled={isSaving} className="btn-primary w-full">{isSaving ? 'Saving...' : 'Save'}</button><button onClick={handleTest} disabled={isTesting} className="btn-secondary w-full border text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2"><PaperPlaneTilt size={16} /> Test</button></div></div></div>
  )
}
