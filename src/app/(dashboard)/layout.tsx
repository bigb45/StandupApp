import Header from '@/components/layout/Header'
import { Toaster } from 'react-hot-toast'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background-cream">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        {children}
      </main>
      <Toaster position="bottom-right" />
    </div>
  )
}
