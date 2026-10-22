'use client'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { Bell, Plus, Zap, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react'
// import { useUserRole } from '@/hooks/useUserRole'
import { useGetProjectQuery, useGetTasksQuery, useGetUserRoleQuery } from '@/lib/store/api'
import AddTask from './AddTask'

const DashboardHeader = () => {
  const [addTaskPopup, setAddTaskPopup] = useState(false)

  const searchParams = useSearchParams()
  const navFilter = searchParams.get('filter') || 'today'

  const isProjectFilter = navFilter.startsWith('project-')
  const projectId = isProjectFilter ? navFilter.replace('project-', '') : null

  // const { isAdmin, userId } = useUserRole()
  const { data: role } = useGetUserRoleQuery(null)
const userId = role?.userId ?? null
const isAdmin = role?.isAdmin ?? false

  const { data: project } = useGetProjectQuery(projectId ?? '', {
    skip: !projectId,
  })

  // نفس الـ args بتاعة DashboardBody بالظبط، فبيشاركوا نفس الـ cache
  const { data: tasks = [] } = useGetTasksQuery(
    { navFilter, projectId, userId: userId ?? '', isAdmin },
    { skip: !userId }
  )

  const title = isProjectFilter
    ? (project?.name || 'Loading...')
    : navFilter === 'today' ? "Today's Tasks"
    : navFilter === 'upcoming' ? 'Upcoming'
    : navFilter === 'all' ? 'All Tasks'
    : navFilter === 'completed' ? 'Completed'
    : navFilter

  const today = new Date().toISOString().split('T')[0]
  const isCompleted = (status?: string) => status?.toLowerCase() === 'completed'

  const dueToday = tasks.filter(
    (t) => t.due_date?.split('T')[0] === today && !isCompleted(t.status)
  ).length
  const highPriority = tasks.filter(
    (t) => t.priority?.toLowerCase() === 'high' && !isCompleted(t.status)
  ).length
  const completed = tasks.filter((t) => isCompleted(t.status)).length
  const doneRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className='w-full border-b border-(--border-color) p-6 pt-15 md:pt-6 '>

      {/* Title Row */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl text-(--text-primary) font-bold'>{title}</h1>
          <p className='text-(--text-secondary) text-sm mt-0.5'>{currentDate}</p>
        </div>

        <div className='flex items-center gap-3'>

          {/* Notifications Button */}
          {/* <button className='relative p-2.5 rounded-xl border border-(--border-color) hover:bg-(--bg-hover) transition-colors cursor-pointer'>
            <Bell size={18} className='text-(--text-secondary)' />
            <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full' />
          </button> */}

          {isAdmin && (
            <button
              onClick={() => setAddTaskPopup(true)}
              className='flex items-center gap-2 bg-(--accent-color) text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer'
            >
              <Plus size={18} />
              New Task
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>

        <div className='flex items-center gap-3 bg-(--bg-secondary) border border-(--border-color) rounded-2xl px-5 py-4'>
          <div className='w-9 h-9 rounded-xl bg-(--accent-color)/10 flex items-center justify-center shrink-0'>
            <Zap size={16} className='text-(--accent-color)' />
          </div>
          <div>
            <p className='text-xl font-bold text-(--text-primary) leading-none'>{dueToday}</p>
            <span className='text-xs text-(--text-secondary)'>Due today</span>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-(--bg-secondary) border border-(--border-color) rounded-2xl px-5 py-4'>
          <div className='w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0'>
            <AlertCircle size={16} className='text-red-500' />
          </div>
          <div>
            <p className='text-xl font-bold text-(--text-primary) leading-none'>{highPriority}</p>
            <span className='text-xs text-(--text-secondary)'>High priority</span>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-(--bg-secondary) border border-(--border-color) rounded-2xl px-5 py-4'>
          <div className='w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0'>
            <CheckCircle2 size={16} className='text-emerald-500' />
          </div>
          <div>
            <p className='text-xl font-bold text-(--text-primary) leading-none'>{completed}</p>
            <span className='text-xs text-(--text-secondary)'>Completed</span>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-(--bg-secondary) border border-(--border-color) rounded-2xl px-5 py-4'>
          <div className='w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0'>
            <TrendingUp size={16} className='text-amber-500' />
          </div>
          <div>
            <p className='text-xl font-bold text-(--text-primary) leading-none'>{doneRate}%</p>
            <span className='text-xs text-(--text-secondary)'>Done rate</span>
          </div>
        </div>

      </div>

      <AddTask
        isOpen={addTaskPopup}
        onClose={() => setAddTaskPopup(false)}
      />
    </header>
  )
}

export default DashboardHeader