'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Task } from '@/lib/supabase/types'


export function useTasks(navFilter: string, projectId: string, userId: string, isAdmin: boolean) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const fetchTasks = async () => {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]

      let query = supabase
        .from('Tasks')
        .select('*, assigned_user:Users!assigned_to(first_name, last_name), project:Projects(name, color)')

      if (projectId) {
        query = query.eq('project_id', projectId)
      } else if (navFilter === 'all') {
        // مفيش فلتر إضافي
      } else if (navFilter === 'completed') {
        query = query.ilike('status', 'completed')
      } else if (navFilter === 'overdue') {
        query = query.not('status', 'ilike', 'completed').lt('due_date', today)
      } else if (navFilter === 'pending') {
        query = query.not('status', 'ilike', 'completed').gte('due_date', today)
      }

      if (!isAdmin) {
        query = query.eq('assigned_to', userId)
      }

      const { data, error } = await query
      console.log('RAW DATA:', data)
      console.log('ERROR:', error)
      setTasks(data || [])
      setLoading(false)
    }

    fetchTasks()

    const channelName = `tasks-channel-${Math.random()}`

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Tasks' },
        () => fetchTasks()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [navFilter, projectId, userId, isAdmin])

  // 👈 دلوقتي جوا الـ function، قبل الـ return النهائي
  const updateTaskLocally = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, ...updates } : t))
    )
  }

  console.log('Query params - isAdmin:', isAdmin, 'userId:', userId, 'navFilter:', navFilter)

  return { tasks, loading, updateTaskLocally }
}

// export function useUpdateTasks (title: string , description: string, status: string, due_date: string, project_id: string, assigned_to: string, priority:string) {

// }

// useTasks.ts
export function useUpdateTask(onSuccess?: (taskId: string, updates: Partial<Task>) => void) {
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('Tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (!error && onSuccess) {
      onSuccess(taskId, updates)  // حدّث الـ UI فوراً
    }

    return { success: !error, data, error: error?.message }
  }

  return { updateTask }
}


// Add Task
export default function useAddTask(onSuccess?: (projectId: string, assignee: string, task: any ) => void) {
  const addTask = async (projectId: string, assignee: string, task: any) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('Tasks')
      .insert([{ ...task, project_id: projectId, assigned_to: assignee }])
      .select()
      .single()

    if (!error && onSuccess) {
      onSuccess(projectId, assignee, data)
    }

    return { success: !error, data, error: error?.message }
  }

  return { addTask }
}