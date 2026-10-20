import { useAddTaskMutation, useGetProjectMembersQuery, useGetProjectsQuery } from '@/lib/store/api'
import { X } from 'lucide-react'
import React, { useState } from 'react'

interface AddTaskProps {
  isOpen: boolean
  onClose: () => void
}

interface TaskFormData {
  title: string
  description: string
  project_id: string
  assigned_to: string | null
  status: string
  priority: string
  due_date: string
  working_on_it: boolean
}

const AddTask = ({ isOpen, onClose }: AddTaskProps) => {
  const [projId, setProjId] = useState<string | null>(null)
  const [assignee, setAssignee] = useState<string | null>(null)

  // 1. القيمة الافتراضية تحتوي الآن على كل الحقول المطلوبة لـ TaskFormData
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    project_id: "",
    assigned_to: "",
    status: "pending",
    priority: "Medium",
    due_date: "",
    working_on_it: false
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }


const { data: projects = [] } = useGetProjectsQuery()
  const { data: members = [] } = useGetProjectMembersQuery(projId ?? '', { skip: !projId })
  const [addTask] = useAddTaskMutation()

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addTask({
        projectId: projId || '',
        assignee: assignee || '',
        task: formData,
      }).unwrap()
      onClose() // بيتقفل بس لو الإضافة نجحت
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }
  
  
  
  if (!isOpen) return null

  const inputClassName =
    "w-full px-4 py-2.5 rounded-xl bg-(--input-bg) border border-(--input-border) text-(--text-primary) placeholder-(--text-secondary) hover:bg-(--accent-color)/10 hover:border-(--accent-color) focus:outline-none focus:border-(--accent-color) focus:ring-1 focus:ring-(--accent-color) transition-all text-sm cursor-pointer"

  const optionClassName = "bg-(--bg-secondary) text-(--text-primary)"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-(--bg-secondary) border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        
        {/* HEADER */}
        <div className="w-full flex justify-between items-center p-6 border-b border-white/5">
          <div>
            <h1 className="text-(--text-primary) font-bold text-xl">Add Task</h1>
            <p className="text-(--text-secondary) text-sm">Add Task and assign it to an employee</p>
          </div>
          <button
            onClick={onClose}
            className="text-(--text-primary) font-bold hover:text-(--text-primary)/50 transition duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form className="p-6 space-y-5 flex-1" onSubmit={handleAddTask}>
          
          {/* Title Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-(--text-primary)">
              Task Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Design Landing Page"
              required
              className={inputClassName}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = `0 0 20px color-mix(in srgb, var(--accent-color) 25%, transparent)`)
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            />
          </div>

          {/* Description Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-(--text-primary)">Description</label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add task description or additional context..."
              className={inputClassName}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = `0 0 20px color-mix(in srgb, var(--accent-color) 25%, transparent)`)
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            />
          </div>

          {/* Grid Layout: Project & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Project Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-(--text-primary)">Project</label>
              <select
                value={projId ?? ""}
                onChange={(e) => {
                  const val = e.target.value || null
                  setProjId(val)
                  setFormData((prev) => ({ ...prev, project_id: val || "" }))
                }}
                className={inputClassName}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 20px color-mix(in srgb, var(--accent-color) 25%, transparent)`)
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <option value="" className={optionClassName}>Select project</option>
                {projects?.map((p) => (
                  <option key={p.id} value={p.id} className={optionClassName}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-(--text-primary)">Assignee</label>
              <select
                value={assignee ?? ""}
                onChange={(e) => {
                  const val = e.target.value || null
                  setAssignee(val)
                  setFormData((prev) => ({ ...prev, assigned_to: val || "" }))
                }}
                className={inputClassName}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 20px color-mix(in srgb, var(--accent-color) 25%, transparent)`)
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <option value="" className={optionClassName}>Unassigned</option>
                {members?.map((m) => (
                  <option key={m.user_id} value={m.user_id} className={optionClassName}>
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
              <label className="text-sm font-medium text-(--text-primary)">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClassName}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 20px color-mix(in srgb, var(--accent-color) 25%, transparent)`)
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <option value="pending" className={optionClassName}>Pending</option>
                <option value="completed" className={optionClassName}>Completed</option>
                <option value="overdue" className={optionClassName}>Overdue</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-(--text-primary)">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={inputClassName}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 20px color-mix(in srgb, var(--accent-color) 25%, transparent)`)
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <option value="Low" className={optionClassName}>Low</option>
                <option value="Medium" className={optionClassName}>Medium</option>
                <option value="High" className={optionClassName}>High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-(--text-primary)">Due Date</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className={inputClassName}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 20px color-mix(in srgb, var(--accent-color) 25%, transparent)`)
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTask