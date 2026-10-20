import React from 'react'

export const cardClassName =
  'bg-(--bg-secondary) border border-(--border-color) rounded-2xl p-5'

export const inputClassName =
  'w-full rounded-xl border border-(--input-border) bg-(--input-bg) px-3.5 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted) outline-none transition-all focus:border-(--accent-color) focus:ring-1 focus:ring-(--accent-color)'

interface FieldProps {
  label: string
  hint?: string
  htmlFor?: string
  children: React.ReactNode
}

export const Field = ({ label, hint, htmlFor, children }: FieldProps) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex flex-col">
      <label htmlFor={htmlFor} className="text-xs font-bold text-(--text-primary)">
        {label}
      </label>
      {hint && <span className="text-[10px] text-(--text-muted)">{hint}</span>}
    </div>
    {children}
  </div>
)