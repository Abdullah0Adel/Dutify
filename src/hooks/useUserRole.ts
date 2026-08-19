'use client'

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"



export function useUserRole (projectId?: string | null) {
    const [userId, setUserId] = useState<string | null>(null)
    const [userRole, setUserRole] = useState<string | null>(null)
    const [isMember, setIsMember] = useState<boolean>(false)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const supabase = createClient()

        const fetchUserAndRole = async () => {
            setLoading(true)

            const { data: { user } } = await supabase.auth.getUser()

            if (!user){
                setLoading(false)
                return
            }

            setUserId(user.id)

            const { data: useData } = await supabase
            .from('Users')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

            const role = useData?.role || 'employee'
            setUserRole(role)

            if (projectId){
                const { data: memberData } = await supabase
                .from('project_members')
                .select('id')
                .eq('project_id', projectId)
                .eq('user_id', user.id)
                .maybeSingle()

                setIsMember(!!memberData)
            }else {
                setIsMember(false)
            }

            setLoading(false)
        }
        fetchUserAndRole()
    }, [projectId])

    const isAdmin = userRole?.toLowerCase() === 'admin'

    return {
    userId,
    userRole,
    isAdmin,
    // المستخدم يستطيع الوصول والتحكم إذا كان Admin أو عضواً في المشروع
    canAccessProject: isAdmin || isMember,
    loading
}
}
