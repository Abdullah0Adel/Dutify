import { createClient } from '@/lib/supabase/client'
import { baseApi } from './baseApi'
import { toError } from './apiUtils'

export interface AppUser {
  id: string
  first_name: string
  last_name: string
}

export interface UserRoleData {
  userId: string | null
  email: string | null
  userRole: string | null
  isAdmin: boolean
  canAccessProject: boolean
}

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  job_title: string | null
  department: string | null
  timezone: string | null
  updated_at: string
}

export type ProfileUpdate = Partial<Omit<UserProfile, 'id' | 'updated_at'>>

const PROFILE_COLUMNS =
  'id, first_name, last_name, display_name, bio, avatar_url, job_title, department, timezone, updated_at'
const AVATAR_BUCKET = 'avatars'

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<AppUser[], void>({
      queryFn: async () => {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('Users')
          .select('id, first_name, last_name')
          .order('first_name', { ascending: true })

        if (error) return { error: toError(error) }
        return { data: (data ?? []) as AppUser[] }
      },
      providesTags: ['Users'],
    }),

    getUserRole: builder.query<UserRoleData, string | null>({
      queryFn: async (projectId) => {
        const supabase = createClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          return {
            data: {
              userId: null,
              email: null,
              userRole: null,
              isAdmin: false,
              canAccessProject: false,
            },
          }
        }

        const { data: userData, error: roleError } = await supabase
          .from('Users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        if (roleError) return { error: toError(roleError) }

        const role: string = userData?.role || 'employee'

        let isMember = false
        if (projectId) {
          const { data: memberData, error: memberError } = await supabase
            .from('project_members')
            .select('id')
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .maybeSingle()

          if (memberError) return { error: toError(memberError) }
          isMember = !!memberData
        }

        const isAdmin = role.toLowerCase() === 'admin'

        return {
          data: {
            userId: user.id,
            email: user.email ?? null,
            userRole: role,
            isAdmin,
            // المستخدم يستطيع الوصول والتحكم إذا كان Admin أو عضواً في المشروع
            canAccessProject: isAdmin || isMember,
          },
        }
      },
      providesTags: (_result, _error, projectId) => [
        'Users',
        ...(projectId ? [{ type: 'Members' as const, id: projectId }] : []),
      ],
    }),

    // ================= MY PROFILE =================
    getMyProfile: builder.query<UserProfile, void>({
      queryFn: async () => {
        const supabase = createClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return { error: { message: 'Not authenticated' } }

        const { data, error } = await supabase
          .from('Users')
          .select(PROFILE_COLUMNS)
          .eq('id', user.id)
          .single()

        if (error) return { error: toError(error) }
        return { data: data as UserProfile }
      },
      providesTags: ['Users'],
    }),

    updateMyProfile: builder.mutation<
      UserProfile,
      { userId: string; updates: ProfileUpdate }
    >({
      queryFn: async ({ userId, updates }) => {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('Users')
          .update(updates)
          .eq('id', userId)
          .select(PROFILE_COLUMNS)
          .single()

        if (error) return { error: toError(error) }
        return { data: data as UserProfile }
      },
      invalidatesTags: ['Users'],
    }),

    uploadAvatar: builder.mutation<string, { userId: string; file: File }>({
      queryFn: async ({ userId, file }) => {
        const supabase = createClient()

        const rawExt = file.type.split('/')[1] || 'png'
        const ext = rawExt === 'jpeg' ? 'jpg' : rawExt
        // اسم مختلف في كل مرة عشان الـ browser/CDN cache ما يعرضش الصورة القديمة
        const path = `${userId}/avatar-${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from(AVATAR_BUCKET)
          .upload(path, file, { contentType: file.type, cacheControl: '3600' })

        if (uploadError) return { error: toError(uploadError) }

        const {
          data: { publicUrl },
        } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path)

        const { error: dbError } = await supabase
          .from('Users')
          .update({ avatar_url: publicUrl })
          .eq('id', userId)

        if (dbError) return { error: toError(dbError) }

        // نمسح الصور القديمة (لو فشل المسح مش مشكلة، فمش بنرجّع error)
        const { data: files } = await supabase.storage
          .from(AVATAR_BUCKET)
          .list(userId)

        const oldFiles = (files ?? [])
          .map((f) => `${userId}/${f.name}`)
          .filter((p) => p !== path)

        if (oldFiles.length > 0) {
          await supabase.storage.from(AVATAR_BUCKET).remove(oldFiles)
        }

        return { data: publicUrl }
      },
      invalidatesTags: ['Users'],
    }),

    removeAvatar: builder.mutation<null, { userId: string }>({
      queryFn: async ({ userId }) => {
        const supabase = createClient()

        const { error: dbError } = await supabase
          .from('Users')
          .update({ avatar_url: null })
          .eq('id', userId)

        if (dbError) return { error: toError(dbError) }

        const { data: files } = await supabase.storage
          .from(AVATAR_BUCKET)
          .list(userId)

        if (files && files.length > 0) {
          await supabase.storage
            .from(AVATAR_BUCKET)
            .remove(files.map((f) => `${userId}/${f.name}`))
        }

        return { data: null }
      },
      invalidatesTags: ['Users'],
    }),
  }),
})

export const {
  useGetAllUsersQuery,
  useGetUserRoleQuery,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUploadAvatarMutation,
  useRemoveAvatarMutation,
} = usersApi