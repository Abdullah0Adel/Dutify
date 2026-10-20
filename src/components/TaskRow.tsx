'use client'

import React, { useState } from 'react'
import { Clock, CheckCircle2, Circle, UserPlus, Zap, Check, X, Pencil } from 'lucide-react'
import {
  useUpdateTaskMutation,
  useGetProjectMembersQuery,
  useGetUserRoleQuery,
} from '@/lib/store/api'
import type { TaskItem } from './TaskSection'
import EditPopup from './EditPopup'

interface TaskRowProps {
  task: TaskItem
  variant: 'overdue' | 'pending' | 'completed'
}

// getPriorityBadgeStyle و stringToColor زي ما هم

export const TaskRow: React.FC<TaskRowProps> = ({ task, variant }) => {
  const [isEditPopup, setIsEditPopup] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)

  const [updateTask] = useUpdateTaskMutation()
  // مهم: كل الـ rows اللي في نفس المشروع بتشارك نفس الـ request والـ cache
  const { data: members = [] } = useGetProjectMembersQuery(task.projectTag.id)



    const { data: role } = useGetUserRoleQuery(task.projectTag.id)
  const isAdmin = role?.isAdmin ?? false


  const isWorking = Boolean(task.working_on_it || task.is_working_on_it)

  const handleComplete = async () => {
    const normalized = task.status?.toLowerCase()
    const newStatus = normalized !== 'completed' ? 'completed' : 'pending'
    await updateTask({ taskId: task.id, updates: { status: newStatus } })
  }

  const handleAssign = async (userId: string) => {
    await updateTask({ taskId: task.id, updates: { assigned_to: userId } })
    setIsAssignOpen(false)
  }

  const handleUnassign = async () => {
    await updateTask({ taskId: task.id, updates: { assigned_to: null } })
    setIsAssignOpen(false)
  }

  const hanleInProgress = async () => {
    await updateTask({ taskId: task.id, updates: { working_on_it: !isWorking } })
  }

  const getPriorityBadgeStyle = (priority: TaskItem['priority']) => {
  switch (priority) {
    case 'High':
      return { backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)' }
    case 'Medium':
      return { backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)' }
    case 'Low':
      return { backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }
  }
}

const stringToColor = (str: string) => {
  const colors = ['#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899']
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

  return (
    <div
      className="group relative flex flex-col md:flex-row md:items-center justify-between p-3.5 md:p-4 gap-3 md:gap-4 rounded-xl border transition-all duration-200"
      style={{
        backgroundColor: isWorking ? 'var(--active-task-bg, rgba(99, 102, 241, 0.05))' : 'var(--bg-secondary)',
        borderColor: isWorking ? 'var(--active-task-border, #6366f1)' : 'var(--border-color)',
        boxShadow: isWorking ? '0 0 12px rgba(99, 102, 241, 0.12)' : 'none',
        opacity: variant === 'completed' ? 0.65 : 1
      }}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <button 
          onClick={handleComplete} 
          className="mt-0.5 shrink-0 transition-transform active:scale-90 cursor-pointer"
          title={variant === 'completed' ? "Mark as pending" : "Mark as completed"}
        >
          {variant === 'completed' ? (
            <CheckCircle2 size={20} style={{ color: 'var(--success-text)' }} />
          ) : (
            <Circle size={20} className="hover:text-indigo-500 transition-colors" style={{ color: 'var(--text-muted)' }} />
          )}
        </button>

        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4
              className={`text-sm font-semibold leading-snug break-words ${variant === 'completed' ? 'line-through' : ''}`}
              style={{ color: 'var(--text-primary)' }}
            >
              {task.title}
            </h4>

            {isWorking && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 animate-pulse shrink-0">
                <Zap size={10} />
                IN PROGRESS
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs line-clamp-2 break-words" style={{ color: 'var(--text-muted)' }}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-medium">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-(--bg-primary) border border-(--border-color) shrink-0" style={{ color: 'var(--text-secondary)' }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: task.projectTag.color }} />
              {task.projectTag.name}
            </span>

            <span className="px-2 py-0.5 rounded-md font-semibold shrink-0" style={getPriorityBadgeStyle(task.priority)}>
              {task.priority}
            </span>

            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md shrink-0"
              style={{
                backgroundColor: variant === 'overdue' ? 'var(--danger-bg)' : 'transparent',
                color: variant === 'overdue' ? 'var(--danger-text)' : 'var(--text-muted)'
              }}
            >
              <Clock size={12} />
              {task.dueDateText}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-(--border-color)/50 shrink-0">
        
        <button 
          onClick={hanleInProgress}
          type="button"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            isWorking 
              ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30 hover:bg-indigo-500/20' 
              : 'bg-(--bg-primary) text-(--text-muted) border-(--border-color) hover:text-(--text-primary)'
          }`}
        >
          <Zap size={12} className={isWorking ? 'fill-indigo-500' : ''} />
          <span>{isWorking ? "Working" : "Start"}</span>
        </button>

        <div className="relative">
          {task.assignee ? (
            <button
              onClick={() => setIsAssignOpen(!isAssignOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-(--bg-hover) transition-colors cursor-pointer shrink-0"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-xs"
                style={{ backgroundColor: task.assignee.avatarBg }}
              >
                {task.assignee.initials}
              </div>
              <span className="text-xs font-medium truncate max-w-[100px] sm:max-w-[130px]" style={{ color: 'var(--text-secondary)' }}>
                {task.assignee.name}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsAssignOpen(!isAssignOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-(--border-color) bg-(--bg-primary) text-(--text-secondary) hover:bg-(--bg-hover) transition-colors cursor-pointer shrink-0"
            >
              <UserPlus size={13} />
              Assign
            </button>
          )}

          {/* Qropdown List */}
          {isAssignOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsAssignOpen(false)} />

              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-xl z-20 py-2 max-h-72 overflow-y-auto"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <p className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-(--text-muted)">
                  Assign to
                </p>

                {task.assignee && (
                  <button
                    onClick={handleUnassign}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-(--bg-hover) transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-(--text-muted)">
                      <X size={14} />
                    </div>
                    <span className="text-xs font-medium text-(--text-muted)">Unassign</span>
                  </button>
                )}

                {members.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-(--text-secondary)">No members found</p>
                ) : (
                  members.map((m) => {
                    const isSelected = task.assignee?.id === m.user_id
                    return (
                      <button
                        key={m.id}
                        onClick={() => handleAssign(m.user_id)}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-(--bg-hover) transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                            style={{ backgroundColor: stringToColor(m.user_id) }}
                          >
                            {m.user.first_name[0]}{m.user.last_name[0]}
                          </div>
                          <div className="flex flex-col items-start min-w-0">
                            <span
                              className="text-xs font-semibold truncate max-w-[120px]"
                              style={{ color: isSelected ? 'var(--accent-color)' : 'var(--text-primary)' }}
                            >
                              {m.user.first_name} {m.user.last_name}
                            </span>
                            <span className="text-[10px] truncate max-w-[120px] text-(--text-muted)">
                              {m.role === 'admin' ? 'Admin' : m.user.job_title || 'Member'}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check size={15} className="shrink-0 text-(--accent-color)" />}
                      </button>
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>

        {isAdmin && (
          <button 
            type="button"
            title="Edit Task"
            onClick={() => setIsEditPopup(true)}
            className="p-1.5 rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-hover) transition-colors cursor-pointer shrink-0"
          >
            <Pencil size={15} />
          </button>
        )}

<EditPopup
  key={`${task.id}-${isEditPopup}`}
  taskId={task.id}
  isOpen={isEditPopup}
  onClose={() => setIsEditPopup(false)}
  taskToEdit={{
    title: task.title,
    description: task.description || '',
    project: task.projectTag.id,
    assignee: task.assignee?.id || '',
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDateText || ''
  }}
/>
      </div>
    </div>
  )
}