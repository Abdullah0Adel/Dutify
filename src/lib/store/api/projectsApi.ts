import { createClient } from '@/lib/supabase/client'
import type { Projects } from '@/lib/supabase/types'
import { baseApi } from './baseApi'
import { toError } from './apiUtils'

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Projects[], void>({
      queryFn: async () => {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('Projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) return { error: toError(error) }
        return { data: (data ?? []) as Projects[] }
      },
      providesTags: ['Projects'],
    }),

    getProject: builder.query<Projects, string>({
      queryFn: async (projectId) => {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('Projects')
          .select('*')
          .eq('id', projectId)
          .single()

        if (error) return { error: toError(error) }
        return { data: data as Projects }
      },
      providesTags: ['Projects'],
    }),

    addProject: builder.mutation<
      Projects,
      { name: string; created_by: string; description: string; color: string }
    >({
      queryFn: async ({ name, created_by, description, color }) => {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('Projects')
          .insert([{ name, created_by, description, color }])
          .select()
          .single()

        if (error) return { error: toError(error) }
        return { data: data as Projects }
      },
      invalidatesTags: ['Projects'],
    }),

    deleteProject: builder.mutation<null, string>({
      queryFn: async (projectId) => {
        const supabase = createClient()
        const { error } = await supabase
          .from('Projects')
          .delete()
          .eq('id', projectId)

        if (error) return { error: toError(error) }
        return { data: null }
      },
      invalidatesTags: ['Projects', 'Tasks', 'Members'],
    }),
  }),
})

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useAddProjectMutation,
  useDeleteProjectMutation,
} = projectsApi