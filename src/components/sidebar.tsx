'use client'
import React, { useMemo, useState } from 'react'
import { Clock, CalendarOff, CircleCheckBig, LayoutGrid, Menu, Search, Settings, X, Plus, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import AddProject from './AddProject';
import DeleteProject from './DeleteProject';
import {
  useGetProjectsQuery,
  useGetTasksQuery,
  useGetUserRoleQuery,
  useGetMyProfileQuery,
} from '@/lib/store/api'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [addProject, setAddProject] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [projectIdDelete, setProjectIdDelete] = useState<string | null>(null)

  const router = useRouter();
  const searchparams = useSearchParams();
  const navFilter = searchparams.get('filter') || 'today'

  const setNavFilter = (filter: string) => {
    router.push(`/dashboard?filter=${filter}`)
    setIsOpen(false)
  }

  const { data: projects = [], isLoading: loading } = useGetProjectsQuery()

  // null بالظبط عشان يشارك نفس الـ cache مع باقي الـ components
  const { data: role } = useGetUserRoleQuery(null)
  const userId = role?.userId ?? null
  const isAdmin = role?.isAdmin ?? false
  const email = role?.email ?? ''

  // الاسم والصورة من البروفايل
  const { data: profile } = useGetMyProfileQuery()
  const fullName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : ''
  const initials =
    `${profile?.first_name?.[0] ?? ''}${profile?.last_name?.[0] ?? ''}`.toUpperCase() || '?'

  // بنجيب كل الـ tasks مرة واحدة ونحسب منها الـ counts (skip لحد ما نعرف الـ userId)
  const { data: allTasks = [] } = useGetTasksQuery(
    { navFilter: 'all', projectId: null, userId: userId ?? '', isAdmin },
    { skip: !userId }
  )

  const counts = useMemo(() => {
    const now = new Date()
    const result = {
      all: allTasks.length,
      pending: 0,
      overdue: 0,
      completed: 0,
      byProject: {} as Record<string, number>,
    }

    for (const t of allTasks) {
      if (t.project_id) {
        result.byProject[t.project_id] = (result.byProject[t.project_id] ?? 0) + 1
      }

      if (t.status?.toLowerCase() === 'completed') {
        result.completed++
      } else if (t.due_date && new Date(t.due_date) < now) {
        result.overdue++
      } else {
        result.pending++
      }
    }

    return result
  }, [allTasks])

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className='md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl dark:bg-[#0b0b12] bg-white shadow-lg border border-white/10'
      >
        <Menu size={20} className='text-[#777795]' />
      </button>

      {/* Overlay - mobile only */}
      {isOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
          fixed md:relative z-50 md:z-auto
          h-full overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}      `}>
        <div className='w-63.75 px-3 flex flex-col gap-5 h-full dark:bg-[#0b0b12] border-r dark:border-slate-800 overflow-y-auto'>

          {/* Logo + Close button */}
          <div className='pt-5 flex items-center justify-between'>
            <button type="button" className='' >
              <img src="/Dutify.png" alt="" className='w-[70%]  ' />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className='md:hidden text-[#777795] hover:text-white transition-colors'
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Input */}
          <div
            className='flex items-center gap-2 px-3 py-2.5 rounded-3xl dark:bg-white/5
            border border-(--text-secondary) dark:border-white/10
            transition-all duration-300
            hover:bg-(--accent-color)/10 hover:border-(--accent-color) hover:backdrop-blur-sm
            focus-within:bg-(--accent-color)/10 focus-within:border-(--accent-color) focus-within:backdrop-blur-md'
            onFocus={e => e.currentTarget.style.boxShadow = `0 0 20px color-mix(in srgb, var(--accent-color) 25%, transparent)`}
            onBlur={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <Search size={15} className='bg-transparent text-(--text-secondary)' />
            <input type="text" placeholder='Search Tasks...' className='text-[#c4c4d8] placeholder:font-light placeholder:text-(--text-secondary)  bg-transparent focus:outline-0 w-full' />
          </div>

          {/* Tasks */}
          <nav className='space-y-0.5'>
            <span className='text-[12px] text-[#777795]'>TASKS</span>
            {[
              { id: 'pending', label: 'Pending', sub: `${counts.pending} pending`, icon: Clock, count: counts.pending },
              { id: 'overdue', label: 'Overdue', sub: `${counts.overdue} overdue`, icon: CalendarOff, count: counts.overdue },
              { id: 'all', label: 'All Tasks', sub: `${counts.all} total`, icon: LayoutGrid, count: 0 },
              { id: 'completed', label: 'Completed', sub: `${counts.completed} done`, icon: CircleCheckBig, count: 0 },
            ].map(({ id, label, sub, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => { setNavFilter(id); setIsOpen(false); }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-2xl text-left transition-all duration-500 cursor-pointer
                  ${navFilter === id ? 'bg-(--accent-color) dark:bg-(--accent-color) ' : 'hover:bg-(--accent-color)/15 '}`}
              >
                <div className='flex items-center gap-3'>
                  <Icon size={20} className={navFilter === id ? 'text-white' : 'text-[#777795]'} />
                  <div className='flex flex-col'>
                    <p className={`font-bold text-[14px] ${navFilter === id ? 'text-white' : 'text-black dark:text-white'}`}>{label}</p>
                    <span className={`text-[12px] font-extralight ${navFilter === id ? 'text-white' : 'text-[#777795]'}`}>{sub}</span>
                  </div>
                </div>
                {count > 0 && (
                  <div className='w-5 h-5 bg-white text-(--accent-color) dark:text-white dark:bg-black/20 flex text-[12px] font-bold justify-center items-center rounded-full'>{count}</div>
                )}
              </button>
            ))}
          </nav>

          {/* Projects */}
          <nav className='space-y-0.5'>
            <div className='flex justify-between items-center '>
              <span className='text-[12px] text-[#777795]'>PROJECTS</span>
              <button
                type="button"
                onClick={() => { setAddProject(true) }}
                className="hover:text-(--text-primary)/50 active:scale-125 focus:outline-none transition duration-300 cursor-pointer"
              >
                <Plus />
              </button>
            </div>

            {loading ? (
              // Skeleton
              <div className='space-y-1 mt-1'>
                {[1, 2, 3].map(i => (
                  <div key={i} className='flex items-center gap-3 px-3 py-2'>
                    <div className='w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/10 animate-pulse' />
                    <div className={`h-3 rounded-full bg-black/10 dark:bg-white/10 animate-pulse ${i === 1 ? 'w-24' : i === 2 ? 'w-16' : 'w-20'}`} />
                  </div>
                ))}
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    setIsOpen(false);
                    setNavFilter(`project-${project.id}`);
                  }}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none
                    ${
                      navFilter === `project-${project.id}`
                        ? 'bg-(--accent-color) text-white shadow-md shadow-indigo-500/10'
                        : 'text-(--text-primary) hover:bg-(--accent-color)/10'
                    }`}
                >
                  {/* الجزء الأيسر: نقطة اللون والاسم */}
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white/20"
                      style={{ backgroundColor: project.color || '#6366f1' }}
                    />
                    <p className="text-sm font-medium truncate">
                      {project.name}
                    </p>
                  </div>

                  {/* الجزء الأيمن: العداد وزر الحذف */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* عداد المهام */}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-semibold transition-colors ${
                        navFilter === `project-${project.id}`
                          ? 'bg-white/20 text-white'
                          : 'bg-(--input-bg) text-(--text-muted) border border-(--border-color)'
                      }`}
                    >
                      {counts.byProject[project.id] ?? 0}
                    </span>

                    {/* زر الحذف: يظهر بنعومة عند الوقوف على العنصر (Group Hover) */}
                    <button
                      type="button"
                      title="Delete Project"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjectIdDelete(project.id);
                        setIsDeleteOpen(true);
                      }}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer
                        ${
                          navFilter === `project-${project.id}`
                            ? 'hover:bg-red-500/80 text-white'
                            : 'text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20'
                        }
                        opacity-0 group-hover:opacity-100 focus:opacity-100`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </nav>

          {/* Spacer */}
          <div className='flex-1' />

          {/* Profile */}
          <div className='flex items-center justify-between gap-2 px-1 pb-5'>
            <div className='flex items-center gap-2 min-w-0'>
              <div className='w-8 h-8 rounded-full overflow-hidden bg-(--accent-color) flex items-center justify-center text-white text-[12px] font-bold shrink-0'>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className='w-full h-full object-cover' />
                ) : (
                  initials
                )}
              </div>
              <div className='flex flex-col min-w-0'>
                <span className='text-[13px] font-semibold text-(--text-primary) truncate'>
                  {fullName || 'Loading...'}
                </span>
                <span className='text-[11px] text-[#777795] truncate'>{email}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/settings')}
              className='text-[#777795] hover:text-white transition-colors cursor-pointer shrink-0'>
              <Settings size={16} />
            </button>
          </div>

        </div>
      </aside>

      <AddProject
        isOpen={addProject}
        onClose={() => setAddProject(false)}
      />

      <DeleteProject
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false) }}
        ProjectToDelete={projectIdDelete}
      />
    </>
  )
}