'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useUserRole } from '@/hooks/useUserRole'
import { useProject } from '@/hooks/useProjects'
import { useTasks } from '@/hooks/useTasks'
import { TaskSection, TaskItem } from './TaskSection' // 👈 استيراد المكون
import { Inbox } from 'lucide-react'

const DashboardBody = () => {
  const searchParams = useSearchParams()

  // 1. استخراج فلاتر الـ URL
  const navFilter = searchParams.get('filter') || 'today'
  const isProjectFilter = navFilter.startsWith('project-')
  const projectId = isProjectFilter ? navFilter.replace('project-', '') : null

  // 2. جلب البيانات من الـ Hooks
  const { project, loading: projectLoading } = useProject(projectId || '')
  const { userId, canAccessProject, loading: roleLoading, isAdmin } = useUserRole(projectId)
  const { tasks, loading: tasksLoading, updateTaskLocally  } = useTasks(navFilter, projectId, userId, isAdmin)

  // 3. حالة التحميل
  if (roleLoading || tasksLoading || (isProjectFilter && projectLoading)) {
    return <p className="p-6 text-[var(--text-muted)]">Loading dashboard...</p>
  }

  // 4. حماية الوصول للمشروع
  if (isProjectFilter && !canAccessProject) {
    return (
      <div className="p-6">
        <p className="text-[var(--danger-text)] font-semibold">
          🚫 You don&apos;t have access to this project.
        </p>
      </div>
    )
  }

  // 5. دالة تحويل المهام القادمة من قاعدة البيانات لتتناسب مع شكل الـ UI
const mapTaskToUI = (task: any): TaskItem => ({
  id: task.id,
  title: task.title,
  description: task.description,
  working_on_it: Boolean(task.working_on_it ?? task.is_working_on_it),
  status: task.status,
  projectTag: {
    id: task.project_id,
    name: task.project?.name || 'Project',    // 👈 من الـ join مباشرة
    color: task.project?.color || '#8b5cf6'    // 👈 وكمان اللون الحقيقي بتاع المشروع
  },
  priority: task.priority || 'Medium',
  dueDateText: task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date',
  assignee: task.assigned_to && task.assigned_user
    ? {
        name: `${task.assigned_user.first_name} ${task.assigned_user.last_name}`,
        initials: `${task.assigned_user.first_name[0]}${task.assigned_user.last_name[0]}`.toUpperCase(),
        avatarBg: '#3b82f6',
        id: task.assigned_to
      }
    : undefined
})
// 6. تقسيم المهام حسَب حالتها (Overdue / Pending / Completed)
  const now = new Date()
  
  const overdueTasks = tasks
    .filter((t) => t.status !== 'completed' && t.due_date && new Date(t.due_date) < now)
    .map(mapTaskToUI)

  const pendingTasks = tasks
    .filter((t) => t.status !== 'completed' && (!t.due_date || new Date(t.due_date) >= now))
    .map(mapTaskToUI)

  const completedTasks = tasks
    .filter((t) => t.status === 'completed')
    .map(mapTaskToUI)



console.log('isAdmin value:', isAdmin, 'projectId:', projectId)
  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* هيدر الصفحة */}
      {/* شرط حالة عدم وجود أي مهام إطلاقاً */}
      {tasks.length === 0 ? (
        isAdmin ? (
          <div className='flex flex-col justify-between items-center gap-1 mt-12'>
            <div className='w-12 h-12 flex justify-center items-center text-(--bg-primary)  dark:text-(--text-muted) bg-(--text-secondary) dark:bg-[#1A1A28]  rounded-2xl  '><Inbox size={20} /></div>
            <p className='text-(--text-primary) font-semibold text-sm '>No Tasks Here</p>
            <p className='text-(--text-muted) text-xs  '>Tap &quot;Add&quot; to create a task</p>
          </div>
        ): 
      (
          <div className='flex flex-col justify-between items-center gap-1 mt-12'>
            <div className='w-12 h-12 flex justify-center items-center text-(--bg-primary)  dark:text-(--text-muted) bg-(--text-secondary) dark:bg-[#1A1A28]  rounded-2xl  '><Inbox size={20} /></div>
            <p className='text-(--text-primary) font-semibold text-sm '>No Tasks Here</p>
          </div>      )
      
      ) : (
        <div className="space-y-4">
          {/* قسم المهام المتأخرة */}
          {overdueTasks.length > 0 && (
            <TaskSection
              title="OVERDUE"
              subtitle="Past due date"
              count={overdueTasks.length}
              variant="overdue"
              tasks={overdueTasks}
              onTaskUpdate={updateTaskLocally}
            />
          )}

          {/* قسم المهام المعلقة */}
          {pendingTasks.length > 0 && (
            <TaskSection
              title="PENDING"
              subtitle="Still pending"
              count={pendingTasks.length}
              variant="pending"
              tasks={pendingTasks}
              onTaskUpdate={updateTaskLocally}
            />
          )}

          {/* قسم المهام المكتملة */}
          {completedTasks.length > 0 && (
            <TaskSection
              title="COMPLETED"
              subtitle="All done!"
              count={completedTasks.length}
              variant="completed"
              tasks={completedTasks}
              onTaskUpdate={updateTaskLocally}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default DashboardBody