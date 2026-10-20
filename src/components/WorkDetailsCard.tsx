'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'
import { Field, cardClassName, inputClassName } from './FormField'
import type { WorkFormValues } from './profileTypes'

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Africa/Cairo', label: 'Cairo' },
  { value: 'Asia/Riyadh', label: 'Riyadh' },
  { value: 'Asia/Dubai', label: 'Dubai' },
  { value: 'Europe/Istanbul', label: 'Istanbul' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Berlin', label: 'Central European Time' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Asia/Kolkata', label: 'India' },
  { value: 'Asia/Singapore', label: 'Singapore' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Australia/Sydney', label: 'Sydney' },
]

const getOffset = (timeZone: string) => {
  try {
    const part = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    })
      .formatToParts(new Date())
      .find((p) => p.type === 'timeZoneName')

    return part ? part.value.replace('GMT', 'UTC') : ''
  } catch {
    return ''
  }
}

interface WorkDetailsCardProps {
  values: WorkFormValues
  onChange: (field: keyof WorkFormValues, value: string) => void
  onSave: () => void
  saving: boolean
  dirty: boolean
  error: string | null
}

const WorkDetailsCard = ({
  values,
  onChange,
  onSave,
  saving,
  dirty,
  error,
}: WorkDetailsCardProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave()
  }

  // لو الـ timezone المحفوظ مش في القائمة نضيفه عشان الـ select ما يبوظش
  const options =
    !values.timezone || TIMEZONES.some((t) => t.value === values.timezone)
      ? TIMEZONES
      : [...TIMEZONES, { value: values.timezone, label: values.timezone }]

  return (
    <form onSubmit={handleSubmit} className={`${cardClassName} space-y-4`}>
      <h2 className="text-sm font-bold text-(--text-primary)">Work details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Job title" htmlFor="job_title">
          <input
            id="job_title"
            type="text"
            value={values.job_title}
            onChange={(e) => onChange('job_title', e.target.value)}
            className={inputClassName}
          />
        </Field>

        <Field label="Department" htmlFor="department">
          <input
            id="department"
            type="text"
            value={values.department}
            onChange={(e) => onChange('department', e.target.value)}
            className={inputClassName}
          />
        </Field>
      </div>

      <Field
        label="Timezone"
        hint="Used for reminders and scheduling"
        htmlFor="timezone"
      >
        <div className="relative">
          <select
            id="timezone"
            value={values.timezone}
            onChange={(e) => onChange('timezone', e.target.value)}
            className={`${inputClassName} appearance-none pr-10 cursor-pointer`}
          >
            <option value="" className="bg-(--bg-secondary) text-(--text-primary)">
              Select timezone
            </option>
            {options.map((tz) => {
              const offset = getOffset(tz.value)
              return (
                <option
                  key={tz.value}
                  value={tz.value}
                  className="bg-(--bg-secondary) text-(--text-primary)"
                >
                  {offset ? `${tz.label} (${offset})` : tz.label}
                </option>
              )
            })}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
          />
        </div>
      </Field>

      {error && <p className="text-xs font-medium text-(--danger-text)">{error}</p>}

      <div className="flex justify-end pt-1">
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

export default WorkDetailsCard