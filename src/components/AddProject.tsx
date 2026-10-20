'use client'

import React, { useState } from 'react'
import {
  useAddProjectMutation,
  useGetUserRoleQuery,
  getErrorMessage,
} from '@/lib/store/api'

interface AddProjectProps {
  isOpen: boolean
  onClose: () => void
}

interface ProjectFormData {
  name: string
  description: string
  color: string
}

const emptyForm: ProjectFormData = { name: '', description: '', color: '' }

// 🔥 استخدام متغيرات الـ Input والألوان المخصصة
const inputClassName =
  'w-full rounded-xl border border-(--input-border) bg-(--input-bg) px-3.5 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted) outline-none transition-all focus:border-indigo-500/60 focus:bg-(--bg-hover)'

const AddProject = ({ isOpen, onClose }: AddProjectProps) => {
  // null بالظبط عشان يشارك نفس الـ cache مع باقي الـ components
  const { data: role } = useGetUserRoleQuery(null)
  const userId = role?.userId ?? null

  const [addProject, { isLoading }] = useAddProjectMutation()

  const [formData, setFormData] = useState<ProjectFormData>(emptyForm)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClose = () => {
    setError(null)
    onClose()
  }

  const handleAddProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!userId) {
      setError('User ID is missing, please sign in again.')
      return
    }

    setError(null)
    try {
      await addProject({
        name: formData.name,
        created_by: userId,
        description: formData.description,
        color: formData.color,
      }).unwrap()

      setFormData(emptyForm)
      onClose()
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to add project')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* 🔥 Modal Panel باستخدم متغيرات الخلفية والـ Border */}
      <form
        className="relative z-10 w-full max-w-lg rounded-2xl border border-(--border-color) bg-(--bg-secondary) p-6 space-y-5 shadow-2xl transition-colors"
        onSubmit={handleAddProject}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-(--border-color)">
          <h2 className="text-lg font-bold text-(--text-primary)">
            Add New Project
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-sm font-semibold text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-(--text-primary)">
            Project Name <span className="text-(--danger-text)">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Design Landing Page"
            required
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-(--text-primary)">
            Description
          </label>
          <textarea
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add project description or additional context..."
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-(--text-primary)">
            Color
          </label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="e.g. #6366f1"
            className={inputClassName}
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-(--danger-text)">{error}</p>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-(--border-color)">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-hover) transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!userId || isLoading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add Project'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProject