'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { TaskRow } from './TaskRow'

export interface TaskItem {
  working_on_it: boolean
  id: string
  title: string
  description?: string
  projectTag: { id: string; name: string; color: string }
  priority: 'High' | 'Medium' | 'Low'
  dueDateText: string
  assignee?: { name: string; avatarBg: string; initials: string; id?: string }
  completed?: boolean
  is_working_on_it?: boolean
  status: string
}

interface TaskSectionProps {
  title: string
  subtitle: string
  count: number
  variant: 'overdue' | 'pending' | 'completed'
  tasks: TaskItem[]
  // onTaskUpdate: (taskId: string, updates: Partial<TaskItem>) => void
}

export const TaskSection: React.FC<TaskSectionProps> = ({
  title, subtitle, count, variant, tasks
}) => {
  const [isOpen, setIsOpen] = useState(true)

  const getHeaderColor = () => {
    switch (variant) {
      case 'overdue': return 'var(--danger-text)'
      case 'pending': return '#8b5cf6'
      case 'completed': return 'var(--success-text)'
    }
  }

  return (
    <div className="w-full mb-6 font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 px-1 text-left select-none transition-opacity hover:opacity-80"
      >
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: getHeaderColor() }} />
          <span style={{ color: getHeaderColor() }} className="uppercase">{title}</span>
          <span style={{ color: 'var(--text-muted)' }} className="font-normal capitalize ml-1">— {subtitle}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[11px] font-semibold ml-0.5"
            style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
            {count}
          </span>
        </div>
        <ChevronDown size={16} style={{ color: 'var(--text-muted)' }}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2.5">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} variant={variant}  />
          ))}
        </div>
      )}
    </div>
  )
}