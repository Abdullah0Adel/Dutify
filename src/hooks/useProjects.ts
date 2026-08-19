'use client'

import { createClient } from "@/lib/supabase/client"
import { Projects } from "@/lib/supabase/types"
import { useEffect, useState } from "react"

export function useProjects() {
    const [projects, setProjects] = useState<Projects[]>([])
    const [loading, setLoading] =useState(true)
    const [error, setError] = useState<string | null>(null)

// FETCH ALL PROJECTS
    useEffect(() => {
        const supabase = createClient()
        const fetchProjects = async () => {
            const {data, error} = await supabase
            .from('Projects')
            .select('*')
            .order('created_at', { ascending: false})

            if (error) setError(error.message)
                else setProjects(data || []); 
            console.log(data)
            setLoading(false)
        }
        fetchProjects()

         // Realtime - بيتحدث أوتوماتيك لما في تغيير
        // const channel = supabase 
        // .channel('projects') // 1. إنشاء قناة اتصال باسم فريد
        // .on('postgres_changes',
        //     {
        //         event: '*', // 2. الاستماع لجميع التغييرات (Insert, Update, Delete)
        //         schema: 'public', // 3. المخطط (Schema) التابع له الجدول
        //         table: 'projects' // 4. اسم الجدول المراقَب
        //     },
        //     () => fetchProjects() // 5. الوظيفة اللي هتشتغل لما يحصل تغيير
        // )
        // .subscribe()// 6. تفعيل الاشتراط/الاتصال

        const channelName = `projects-channel-${Math.random()}`
        const channel = supabase
        .channel(channelName)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'Projects' }, () => fetchProjects())
        .subscribe()

        return () => {
            supabase.removeChannel(channel)
        } //تنظيف الاتصال (Cleanup Function)
    }, [])

    return {projects, loading, error}
}

// FETCH SINGLE PROJECT
export function useProject(projectId: string) {
    const [project, setproject] = useState<Projects | null>(null)
    const [loading, setLoading] =useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if(!projectId) return

        const supabase = createClient();

        const fetchSingleProject = async () => {
            const {data , error} = await supabase
            .from('Projects')
            .select('*')
            .eq('id', projectId)
            .single()

            if(!error){
                setproject(data)
                setLoading(false)
            } 
            else {setError(error.message)}
        }

        fetchSingleProject()
    }, [projectId])

    return { project, error, loading }
} 

// hooks/useProjects.ts
export  function useAddProject(onSuccess?: (name: string, created_by: string, description: string, color: string) => void) {
  const addProject = async (name: string, created_by: string, description: string, color: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('Projects')
      .insert([{ name, created_by, description, color }])
      .select()
      .single()

    if (!error && onSuccess) {
      onSuccess(name, created_by, description, color)
    }

    return { success: !error, data, error: error?.message }
  }

  // 🔥 إرجاع Object يحتوي على الدالة
  return { addProject }
}



export default function useDeleteProject(onSuccess?: (projectId: string) => void) {
  const deleteProject = async (projectId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('Projects')
      .delete()
      .eq('id', projectId)

    if (!error && onSuccess) {
      onSuccess(projectId)
    }

    return { success: !error, error: error?.message }
  }

  return { deleteProject }
}