'use client'

import React from 'react'
import { Field, cardClassName, inputClassName } from './FormField'
import type { PersonalFormValues } from './profileTypes'

interface PersonalInfoCardProps {
  values: PersonalFormValues
  onChange: (field: keyof PersonalFormValues, value: string) => void
  onSave: () => void
  saving: boolean
  dirty: boolean
  error: string | null
  lastUpdatedText: string
}

const PersonalInfoCard = ({
  values,
  onChange,
  onSave,
  saving,
  dirty,
  error,
  lastUpdatedText,
}: PersonalInfoCardProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave()
  }

  return (
    <form onSubmit={handleSubmit} className={`${cardClassName} space-y-4`}>
      <h2 className="text-sm font-bold text-(--text-primary)">Personal information</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="First name" htmlFor="first_name">
          <input
            id="first_name"
            type="text"
            value={values.first_name}
            onChange={(e) => onChange('first_name', e.target.value)}
            className={inputClassName}
          />
        </Field>

        <Field label="Last name" htmlFor="last_name">
          <input
            id="last_name"
            type="text"
            value={values.last_name}
            onChange={(e) => onChange('last_name', e.target.value)}
            className={inputClassName}
          />
        </Field>
      </div>

      <Field
        label="Display name"
        hint="Shown in comments and activity"
        htmlFor="display_name"
      >
        <input
          id="display_name"
          type="text"
          value={values.display_name}
          onChange={(e) => onChange('display_name', e.target.value)}
          className={inputClassName}
        />
      </Field>

      <Field label="Bio" hint="Max 160 characters" htmlFor="bio">
        <textarea
          id="bio"
          rows={3}
          maxLength={160}
          value={values.bio}
          onChange={(e) => onChange('bio', e.target.value)}
          className={`${inputClassName} resize-none`}
        />
        <span className="self-end text-[10px] text-(--text-muted)">
          {values.bio.length}/160
        </span>
      </Field>

      {error && <p className="text-xs font-medium text-(--danger-text)">{error}</p>}

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-(--text-muted)">Last updated {lastUpdatedText}</span>
        <button
          type="submit"
          disabled={!dirty || saving}
          className="px-4 py-2.5 rounded-full bg-(--accent-color) text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

export default PersonalInfoCard