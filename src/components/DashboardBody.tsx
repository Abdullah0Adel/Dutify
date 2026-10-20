'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  useGetProjectQuery,
  useGetTasksQuery,
  useGetProjectMembersQuery,
  useGetAllUsersQuery,
  useGetUserRoleQuery,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
  getErrorMessage,
} from '@/lib/store/api'
import { TaskSection, TaskItem } from './TaskSection'
import AddMemberModal from './AddMemberModal'
import { Inbox } from 'lucide-react'

const DashboardBody = () => {
  const searchParams = useSearchParams()

  // 1. استخراج فلاتر الـ URL
  const navFilter = searchParams.get('filter') || 'today'
  const isProjectFilter = navFilter.startsWith('project-')
  const projectId = isProjectFilter ? navFilter.replace('project-', '') : null

  // 2. جلب البيانات
  const { isLoading: projectLoading } = useGetProjectQuery(projectId ?? '', {
    skip: !projectId,
  })
  const { data: role, isLoading: roleLoading } = useGetUserRoleQuery(projectId)
  const userId = role?.userId ?? null
  const isAdmin = role?.isAdmin ?? false
  const canAccessProject = role?.canAccessProject ?? false

  // skip لحد ما نعرف الـ userId عشان ما نعملش query بـ id فاضي
  const { data: tasks = [], isLoading: tasksLoading } = useGetTasksQuery(
    { navFilter, projectId, userId: userId ?? '', isAdmin },
    { skip: !userId }
  )

  // Members (لازم فوق الـ early returns)
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)

  const { data: members = [], isLoading: loadingMembers } =
    useGetProjectMembersQuery(projectId ?? '', { skip: !projectId })

  // اليوزرز بنجيبهم بس لما الـ modal يتفتح
  const { data: users = [], isLoading: loadingUsers, error: usersErr } =
    useGetAllUsersQuery(undefined, { skip: !isMembersModalOpen })

  const [
    addMember,
    { isLoading: isAdding, originalArgs: addArgs, error: addErr, reset: resetAdd },
  ] = useAddProjectMemberMutation()

  const [
    removeMember,
    { isLoading: isRemoving, originalArgs: removeArgs, error: removeErr, reset: resetRemove },
  ] = useRemoveProjectMemberMutation()

  // الزرار اللي بيتعمله loading هو بتاع اليوزر اللي بيتضاف/بيتشال بس
  const addingUserId = isAdding ? addArgs?.userId ?? null : null
  const removingUserId = isRemoving ? removeArgs?.userId ?? null : null

  // الـ ids بتاعت اللي متضافين، عشان الـ modal يعرف مين "Added"
  const memberIds = new Set(members.map((m) => m.user_id))

  const handleCloseMembersModal = () => {
    setIsMembersModalOpen(false)
    resetAdd()
    resetRemove()
  }

  const handleAddMember = async (newUserId: string, role: string) => {
    if (!projectId) return
    resetRemove()
    await addMember({ projectId, userId: newUserId, role })
  }

  const handleRemoveMember = async (memberUserId: string) => {
    if (!projectId) return
    resetAdd()
    await removeMember({ projectId, userId: memberUserId })
  }

  if (roleLoading || tasksLoading || (isProjectFilter && projectLoading)) {
    return <p className="p-6 text-[var(--text-muted)]">Loading dashboard...</p>
  }

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
      name: task.project?.name || 'Project',
      color: task.project?.color || '#8b5cf6'
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

  // 6. تقسيم المهام حسب حالتها (Overdue / Pending / Completed)
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

  return (
    <div className="p-6 min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {projectId && isAdmin && (
        <div className="flex items-center justify-start">
          <button
            onClick={() => setIsMembersModalOpen(true)}
            className=" mb-7 flex items-center gap-2 bg-(--accent-color) text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            Add Member
          </button>
        </div>
      )}

      <AddMemberModal
        isOpen={isMembersModalOpen}
        members={members}
        allUsers={users}
        memberIds={memberIds}
        currentUserId={userId}
        loadingMembers={loadingMembers}
        loadingUsers={loadingUsers}
        addingUserId={addingUserId}
        removingUserId={removingUserId}
        error={getErrorMessage(addErr) || getErrorMessage(removeErr) || getErrorMessage(usersErr)}
        onClose={handleCloseMembersModal}
        onAdd={handleAddMember}
        onRemove={handleRemoveMember}
      />

      <div>
        {tasks.length === 0 ? (
          isAdmin ? (
            <div className="flex flex-col justify-between items-center gap-1 mt-12">
              <div className="w-12 h-12 flex justify-center items-center text-(--bg-primary) dark:text-(--text-muted) bg-(--text-secondary) dark:bg-[#1A1A28] rounded-2xl">
                <Inbox size={20} />
              </div>
              <p className="text-(--text-primary) font-semibold text-sm">No Tasks Here</p>
              <p className="text-(--text-muted) text-xs">Tap &quot;Add&quot; to create a task</p>
            </div>
          ) : (
            <div className="flex flex-col justify-between items-center gap-1 mt-12">
              <div className="w-12 h-12 flex justify-center items-center text-(--bg-primary) dark:text-(--text-muted) bg-(--text-secondary) dark:bg-[#1A1A28] rounded-2xl">
                <Inbox size={20} />
              </div>
              <p className="text-(--text-primary) font-semibold text-sm">No Tasks Here</p>
            </div>
          )
        ) : (
          <div className="space-y-4">
            {overdueTasks.length > 0 && (
              <TaskSection
                title="OVERDUE"
                subtitle="Past due date"
                count={overdueTasks.length}
                variant="overdue"
                tasks={overdueTasks}
              />
            )}

            {pendingTasks.length > 0 && (
              <TaskSection
                title="PENDING"
                subtitle="Still pending"
                count={pendingTasks.length}
                variant="pending"
                tasks={pendingTasks}
              />
            )}

            {completedTasks.length > 0 && (
              <TaskSection
                title="COMPLETED"
                subtitle="All done!"
                count={completedTasks.length}
                variant="completed"
                tasks={completedTasks}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardBody