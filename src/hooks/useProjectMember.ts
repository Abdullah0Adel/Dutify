// 'use client'
// import { useCallback, useEffect, useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { ProjectMemberWithUser } from '@/lib/supabase/types'

// export function useProjectMembers(
//   projectId: string | string[] | null | undefined
// ) {
//   const [members, setMembers] = useState<ProjectMemberWithUser[]>([])
//   const [loadingMembers, setLoadingMembers] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [refreshKey, setRefreshKey] = useState(0)

//   // تحويل الـ ID إلى نص ثابت لتفادي الـ Infinite Loop في الـ useEffect
//   const normalizedId = Array.isArray(projectId)
//     ? projectId.join(',')
//     : projectId ?? ''

//   const refetch = useCallback(() => setRefreshKey((k) => k + 1), [])

//   useEffect(() => {
//     let cancelled = false

//     const fetchMembers = async () => {
//       // إذا كان الـ projectId غير موجود أو مصفوفة فارغة
//       if (!projectId || (Array.isArray(projectId) && projectId.length === 0)) {
//         setMembers([])
//         setLoadingMembers(false)
//         return
//       }

//       setLoadingMembers(true)
//       setError(null)

//       const supabase = createClient()

//       // التمييز بين الاستعلام عن ID مفرد أو مجموعة IDs
//       let query = supabase
//         .from('project_members')
//         .select('*, user:Users(first_name, last_name)')

//       if (Array.isArray(projectId)) {
//         query = query.in('project_id', projectId)
//       } else {
//         query = query.eq('project_id', projectId)
//       }

//       const { data, error } = await query

//       if (cancelled) return

//       if (error) {
//         setError(error.message)
//         setMembers([])
//       } else {
//         setMembers((data as ProjectMemberWithUser[]) || [])
//       }

//       setLoadingMembers(false)
//     }

//     void fetchMembers()

//     return () => {
//       cancelled = true
//     }
//   }, [normalizedId, refreshKey])

//   return { members, loadingMembers, error, refetch }
// }

// export function useAddProjectMember() {
//   // بنخزن الـ id بتاع اليوزر اللي بيتضاف عشان الـ loading يظهر على الزرار بتاعه بس
//   const [addingUserId, setAddingUserId] = useState<string | null>(null)
//   const [addError, setAddError] = useState<string | null>(null)

//   const addMember = async (
//     projectId: string,
//     userId: string,
//     role: string = 'member'
//   ): Promise<boolean> => {
//     setAddingUserId(userId)
//     setAddError(null)

//     const supabase = createClient()

//     const { error: insertError } = await supabase
//       .from('project_members')
//       .insert({ project_id: projectId, user_id: userId, role })

//     setAddingUserId(null)

//     if (insertError) {
//       setAddError(insertError.message)
//       return false
//     }

//     return true
//   }

//   const resetAddError = () => setAddError(null)

//   return { addMember, addingUserId, addError, resetAddError }
// }

// export function useRemoveProjectMember() {
//   // نفس فكرة الـ add: الـ loading على الزرار بتاع اليوزر ده بس
//   const [removingUserId, setRemovingUserId] = useState<string | null>(null)
//   const [removeError, setRemoveError] = useState<string | null>(null)

//   const removeMember = async (
//     projectId: string,
//     userId: string
//   ): Promise<boolean> => {
//     setRemovingUserId(userId)
//     setRemoveError(null)

//     const supabase = createClient()

//     const { error: deleteError } = await supabase
//       .from('project_members')
//       .delete()
//       .eq('project_id', projectId)
//       .eq('user_id', userId)

//     setRemovingUserId(null)

//     if (deleteError) {
//       setRemoveError(deleteError.message)
//       return false
//     }

//     return true
//   }

//   const resetRemoveError = () => setRemoveError(null)

//   return { removeMember, removingUserId, removeError, resetRemoveError }
// }