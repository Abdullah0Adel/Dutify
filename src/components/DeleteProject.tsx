import { useDeleteProjectMutation } from '@/lib/store/api'
import { X } from 'lucide-react'
import React from 'react'

interface DeleteProjectProps {
  isOpen: boolean
  onClose: () => void
  ProjectToDelete: string | null   
}


const DeleteProject = ({isOpen, onClose, ProjectToDelete}: DeleteProjectProps ) => {


  const [deleteProject] = useDeleteProjectMutation()

  const handleDeleteProject = async () => {
    if (!ProjectToDelete) return
    try {
      await deleteProject(ProjectToDelete).unwrap()
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

    if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-(--bg-secondary) border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        
        {/* HEADER */}
        <div className="w-full flex justify-between items-center p-6 border-b border-white/5">
          <div>
            <h1 className="text-(--text-primary) font-bold text-xl">Add Task</h1>
            <p className="text-(--text-secondary) text-sm">Add Task and assign it to an employee</p>
          </div>
          <button
            onClick={onClose}
            className="text-(--text-primary) font-bold hover:text-(--text-primary)/50 transition duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        
        <div>
            <button 
            onClick={onClose}>
                Cancel
            </button>
            
            <button 
            onClick={handleDeleteProject}
            >
                Delete
            </button>
        </div>
      </div>
    </div>

  )
}

export default DeleteProject
