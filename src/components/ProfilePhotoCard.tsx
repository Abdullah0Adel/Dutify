'use client'

import React, { useRef } from 'react'
import { Camera, Upload } from 'lucide-react'
import { cardClassName } from './FormField'

interface ProfilePhotoCardProps {
  firstName: string
  lastName: string
  avatarUrl: string | null
  uploading: boolean
  removing: boolean
  error: string | null
  onSelectFile: (file: File) => void
  onRemove: () => void
}

const ProfilePhotoCard = ({
  firstName,
  lastName,
  avatarUrl,
  uploading,
  removing,
  error,
  onSelectFile,
  onRemove,
}: ProfilePhotoCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initials =
    `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?'
  const busy = uploading || removing

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onSelectFile(file)
    e.target.value = '' // عشان نقدر نختار نفس الملف تاني
  }

  return (
    <div className={cardClassName}>
      <h2 className="text-sm font-bold text-(--text-primary) mb-4">Profile photo</h2>

      <div className="flex items-center gap-4">
        <div className="relative h-18 w-18 shrink-0">
          <div className="h-full w-full rounded-2xl overflow-hidden bg-(--accent-color) flex items-center justify-center text-white text-2xl font-bold">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            title="Change photo"
            className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-(--bg-primary) border border-(--border-color) flex items-center justify-center text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer disabled:opacity-50"
          >
            <Camera size={12} />
          </button>
        </div>

        <div className="flex flex-col gap-1.5 min-w-0">
          <p className="text-sm font-semibold text-(--text-primary) truncate">
            {firstName} {lastName}
          </p>
          <p className="text-[11px] text-(--text-muted)">JPG, PNG or GIF · max 5 MB</p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-(--accent-color) text-white text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
            >
              <Upload size={12} />
              {uploading ? 'Uploading...' : 'Upload'}
            </button>

            <button
              type="button"
              onClick={onRemove}
              disabled={busy || !avatarUrl}
              className="px-3 py-1.5 rounded-full bg-(--bg-hover) text-(--text-muted) text-xs font-semibold hover:text-(--text-primary) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {removing ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {error && <p className="mt-3 text-xs font-medium text-(--danger-text)">{error}</p>}
    </div>
  )
}

export default ProfilePhotoCard