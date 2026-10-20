export type UserRole = 'admin' | 'employee'

export interface Profile {
    id: string
    first_name: string
    last_name: string
    role: string
    created_at: string
}

export interface Projects {
    count: number
    id: string
    created_at: string
    name: string
    created_by: string
    description: string | null
    color: string
}

export interface Task {
    id: string
    created_at: string
    title: string
    descrption: string
    status: string
    due_date: string | null
    project_id: string
    assigned_to: string | null
    priority: string
    working_on_it: boolean
}

export interface ProjectMemberWithUser {
  id: string
  project_id: string
  user_id: string
  role: 'admin' | 'member'
  created_at: string
  user: {
    job_title: string
    first_name: string
    last_name: string
  }
}