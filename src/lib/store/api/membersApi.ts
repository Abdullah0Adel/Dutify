import { createClient } from '@/lib/supabase/client'
import type { ProjectMemberWithUser } from '@/lib/supabase/types'
import { baseApi } from './baseApi'
import { toError } from './apiUtils'

export const membersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectMembers: builder.query<ProjectMemberWithUser[], string>({
      queryFn: async (projectId) => {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('project_members')
          .select('*, user:Users(first_name, last_name)')
          .eq('project_id', projectId)

        if (error) return { error: toError(error) }
        return { data: (data ?? []) as ProjectMemberWithUser[] }
      },
      providesTags: (_result, _error, projectId) => [
        { type: 'Members', id: projectId },
      ],
    }),

    addProjectMember: builder.mutation<
      null,
      { projectId: string; userId: string; role: string }
    >({
      queryFn: async ({ projectId, userId, role }) => {
        const supabase = createClient()
        const { error } = await supabase
          .from('project_members')
          .insert({ project_id: projectId, user_id: userId, role })

        if (error) return { error: toError(error) }
        return { data: null }
      },
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'Members', id: projectId },
      ],
    }),

    removeProjectMember: builder.mutation<
      null,
      { projectId: string; userId: string }
    >({
      queryFn: async ({ projectId, userId }) => {
        const supabase = createClient()
        const { error } = await supabase
          .from('project_members')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', userId)

        if (error) return { error: toError(error) }
        return { data: null }
      },
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'Members', id: projectId },
      ],
    }),
  }),
})

export const {
  useGetProjectMembersQuery,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
} = membersApi