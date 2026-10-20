import { Suspense } from 'react'
import Sidebar from '@/components/sidebar'
import DashboardHeader from '@/components/DashboardHeader'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>

      <div className="bg-(--bg-primary) flex-1 overflow-y-auto">
        <Suspense fallback={null}>
          <DashboardHeader />
        </Suspense>
        {children}
      </div>
    </div>
  )
}