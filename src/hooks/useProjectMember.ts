'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProjectMemberWithUser, Task } from '@/lib/supabase/types'

export function useProjectMembers(projectId: string[]) {
    const [members, setMembers] = useState<ProjectMemberWithUser[]>([])
    const [loadingMembers, setLoadingMembers] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
  useEffect(() => {
    
    
    let cancelled = false
    
    const fetchMembers = async () => {
      if (!projectId) {
        setMembers([])
        setLoadingMembers(false)
        return
      }
      setLoadingMembers(true)
      setError(null)

      const supabase = createClient()
      const { data, error } = await supabase
        .from('project_members')
        .select('*, user:Users(first_name, last_name)')
        .eq('project_id', projectId)

      if (cancelled) return

      if (error) {
        setError(error.message)
        setMembers([])
      } else {
        setMembers(data as ProjectMemberWithUser[] || [])
      }

      setLoadingMembers(false)
    }

    void fetchMembers()

    return () => {
      cancelled = true
    }
  }, [projectId])




  
  
    return { members, loadingMembers, error, }
} 