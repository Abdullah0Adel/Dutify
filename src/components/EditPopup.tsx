'use client'

import { useProjects } from '@/hooks/useProjects'
import { useProjectMembers } from '@/hooks/useProjectMember'
import { useUpdateTask } from '@/hooks/useTasks'
import type { TaskItem } from './TaskSection'
import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface EditPopupProps {
  isOpen: boolean
  onClose: () => void
  taskToEdit: TaskFormData
  taskId: string
  onTaskUpdate: (taskId: string, updates: Partial<TaskItem>) => void
}

interface TaskFormData {
  title: string
  description: string
  project: string
  assignee: string
  priority: 'Low' | 'Medium' | 'High'
  status: string
  dueDate: string
}

// دالة مساعدة لضبط الـ Priority ليكون أول حرف Capital
const formatPriority = (priority: string): 'Low' | 'Medium' | 'High' => {
  if (!priority) return 'Medium'
  const formatted = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
  if (formatted === 'Low' || formatted === 'High') return formatted
  return 'Medium'
}

// دالة تحويل timestamptz إلى YYYY-MM-DD
const formatTimestamptzToDateInput = (dateStr?: string): string => {
  if (!dateStr) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const EditPopup = ({ isOpen, onClose, taskToEdit, taskId, onTaskUpdate }: EditPopupProps) => {

  const [formData, setFormData] = useState<TaskFormData>({
    title: taskToEdit?.title || '',
    description: taskToEdit?.description || '',
    project: taskToEdit?.project || '',
    assignee: taskToEdit?.assignee || '',
    status: taskToEdit?.status || 'pending',
    priority: formatPriority(taskToEdit?.priority),
    dueDate: formatTimestamptzToDateInput(taskToEdit?.dueDate)
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { updateTask } = useUpdateTask()
  const { projects } = useProjects()
  const { members } = useProjectMembers(formData.project)   // 👈 أعضاء المشروع المختار حالياً

  // تحديث القيم عند فتح الـ Popup أو تغيير التاسك
  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        project: taskToEdit.project || '',
        assignee: taskToEdit.assignee || '',
        status: taskToEdit.status || 'pending',
        priority: formatPriority(taskToEdit.priority),
        dueDate: formatTimestamptzToDateInput(taskToEdit.dueDate)
      })
    }
  }, [taskToEdit, isOpen])

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const result = await updateTask(taskId, {
      title: formData.title,
      description: formData.description,
      project_id: formData.project,
      assigned_to: formData.assignee ,
      priority: formData.priority,
      status: formData.status,
      due_date: formData.dueDate || null
    })

    setSaving(false)

    if (result.success) {
      onTaskUpdate(taskId, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority
      })
      onClose()
    } else {
      setError(result.error || 'Failed to update task')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-(--bg-secondary) border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Edit Task</h2>
            <p className="text-sm text-gray-400 mt-1">Update your task details and options below.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X />
          </button>
        </div>

        {/* Form Body */}
        <form className="p-6 space-y-5 flex-1" onSubmit={handleEditTask}>

          {/* Title Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Task Title <span className="text-red-400">*</span>
            </label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              type="text"
              placeholder="e.g. Design Landing Page"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>

          {/* Description Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Add task description or additional context..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none"
            />
          </div>

          {/* Grid Layout: Project & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Project Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Project</label>
              <select
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value, assignee: '' })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm cursor-pointer"
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Assignee</label>
              <select
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                disabled={!formData.project}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.user.first_name} {m.user.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid Layout: Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Status Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskFormData['priority'] })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default EditPopup