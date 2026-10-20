import { Suspense } from 'react'
import DashboardBody from '@/components/DashboardBody'

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading dashboard...</p>}>
      <DashboardBody />
    </Suspense>
  )
}