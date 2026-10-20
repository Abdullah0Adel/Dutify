// 'use client'
// import { useEffect, useState } from 'react'
// import { createClient } from '@/lib/supabase/client'

// export interface AppUser {
//   id: string
//   first_name: string
//   last_name: string
// }

// // جلب كل اليوزرز (بيشتغل بس لما enabled = true، يعني لما الـ modal يتفتح)
// export function useAllUsers(enabled: boolean) {
//   const [users, setUsers] = useState<AppUser[]>([])
//   const [loadingUsers, setLoadingUsers] = useState(false)
//   const [usersError, setUsersError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!enabled) return

//     let cancelled = false

//     const fetchUsers = async () => {
//       setLoadingUsers(true)
//       setUsersError(null)

//       const supabase = createClient()

//       const { data, error } = await supabase
//         .from('Users')
//         .select('id, first_name, last_name')
//         .order('first_name', { ascending: true })

//       if (cancelled) return

//       if (error) {
//         setUsersError(error.message)
//         setUsers([])
//       } else {
//         setUsers((data as AppUser[]) || [])
//       }

//       setLoadingUsers(false)
//     }

//     void fetchUsers()

//     return () => {
//       cancelled = true
//     }
//   }, [enabled])

//   return { users, loadingUsers, usersError }
// }