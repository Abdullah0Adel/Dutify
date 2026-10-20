import { createClient } from '@/lib/supabase/client'
import type { Task } from '@/lib/supabase/types'
import { baseApi } from './baseApi'
import { toError } from './apiUtils'

export interface TasksArgs {
  navFilter: string
  projectId: string | null
  userId: string
  isAdmin: boolean
}

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], TasksArgs>({
      queryFn: async ({ navFilter, projectId, userId, isAdmin }) => {
        const supabase = createClient()
        const today = new Date().toISOString().split('T')[0]

        let query = supabase
          .from('Tasks')
          .select(
            '*, assigned_user:Users!assigned_to(first_name, last_name), project:Projects(name, color)'
          )

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

        if (error) return { error: toError(error) }
        return { data: (data ?? []) as Task[] }
      },
      providesTags: ['Tasks'],
    }),

    updateTask: builder.mutation<
      Task,
      { taskId: string; updates: Partial<Task> }
    >({
      queryFn: async ({ taskId, updates }) => {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('Tasks')
          .update(updates)
          .eq('id', taskId)
          .select()
          .single()

        if (error) return { error: toError(error) }
        return { data: data as Task }
      },
      invalidatesTags: ['Tasks'],
    }),

    addTask: builder.mutation<
      Task,
      { projectId: string; assignee: string; task: any }
    >({
      queryFn: async ({ projectId, assignee, task }) => {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('Tasks')
          .insert([
            { ...task, project_id: projectId, assigned_to: assignee || null },
          ])
          .select()
          .single()

        if (error) return { error: toError(error) }
        return { data: data as Task }
      },
      invalidatesTags: ['Tasks'],
    }),
  }),
})

export const {
  useGetTasksQuery,
  useUpdateTaskMutation,
  useAddTaskMutation,
} = tasksApi