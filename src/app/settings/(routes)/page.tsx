'use client'

import React, { useEffect, useState } from 'react'
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUploadAvatarMutation,
  useRemoveAvatarMutation,
  getErrorMessage,
} from '@/lib/store/api'
import type { UserProfile } from '@/lib/store/api'
import { timeAgo } from '@/lib/utils/timeAgo'
import ProfilePhotoCard from '@/components/ProfilePhotoCard'
import PersonalInfoCard from '@/components/PersonalInfoCard'
import WorkDetailsCard from '@/components/WorkDetailsCard'
import type {
  PersonalFormValues,
  WorkFormValues,
} from '@/components/profileTypes'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

const toPersonal = (p: UserProfile): PersonalFormValues => ({
  first_name: p.first_name ?? '',
  last_name: p.last_name ?? '',
  display_name: p.display_name ?? '',
  bio: p.bio ?? '',
})

const toWork = (p: UserProfile): WorkFormValues => ({
  job_title: p.job_title ?? '',
  department: p.department ?? '',
  timezone: p.timezone ?? '',
})

const isDifferent = <T extends object>(a: T, b: T) =>
  (Object.keys(a) as (keyof T)[]).some((key) => a[key] !== b[key])

const ProfileSettingsPage = () => {
  const { data: profile, isLoading, error: profileError } = useGetMyProfileQuery()

  const [updateProfile] = useUpdateMyProfileMutation()
  const [uploadAvatar, { isLoading: uploading }] = useUploadAvatarMutation()
  const [removeAvatar, { isLoading: removing }] = useRemoveAvatarMutation()

  const [personal, setPersonal] = useState<PersonalFormValues | null>(null)
  const [work, setWork] = useState<WorkFormValues | null>(null)
  const [savingSection, setSavingSection] = useState<'personal' | 'work' | null>(null)

  const [photoError, setPhotoError] = useState<string | null>(null)
  const [personalError, setPersonalError] = useState<string | null>(null)
  const [workError, setWorkError] = useState<string | null>(null)

  // نملا الفورم مرة واحدة بس لما الـ profile يوصل
  useEffect(() => {
    if (profile && !personal) setPersonal(toPersonal(profile))
    if (profile && !work) setWork(toWork(profile))
  }, [profile, personal, work])

  const personalDirty =
    !!profile && !!personal && isDifferent(personal, toPersonal(profile))
  const workDirty = !!profile && !!work && isDifferent(work, toWork(profile))

  // ---------- Photo ----------
  const handleSelectAvatar = async (file: File) => {
    if (!profile) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoError('Please choose a JPG, PNG or GIF image.')
      return
    }
    if (file.size > MAX_SIZE) {
      setPhotoError('Image must be 5 MB or smaller.')
      return
    }

    setPhotoError(null)
    try {
      await uploadAvatar({ userId: profile.id, file }).unwrap()
    } catch (err) {
      setPhotoError(getErrorMessage(err) || 'Failed to upload photo')
    }
  }

  const handleRemoveAvatar = async () => {
    if (!profile) return

    setPhotoError(null)
    try {
      await removeAvatar({ userId: profile.id }).unwrap()
    } catch (err) {
      setPhotoError(getErrorMessage(err) || 'Failed to remove photo')
    }
  }

  // ---------- Personal ----------
  const handlePersonalChange = (field: keyof PersonalFormValues, value: string) => {
    setPersonal((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleSavePersonal = async () => {
    if (!profile || !personal) return

    const cleaned: PersonalFormValues = {
      first_name: personal.first_name.trim(),
      last_name: personal.last_name.trim(),
      display_name: personal.display_name.trim(),
      bio: personal.bio.trim(),
    }

    if (!cleaned.first_name || !cleaned.last_name) {
      setPersonalError('First name and last name are required.')
      return
    }

    setPersonalError(null)
    setSavingSection('personal')
    try {
      await updateProfile({
        userId: profile.id,
        updates: {
          first_name: cleaned.first_name,
          last_name: cleaned.last_name,
          display_name: cleaned.display_name || null,
          bio: cleaned.bio || null,
        },
      }).unwrap()
      setPersonal(cleaned)
    } catch (err) {
      setPersonalError(getErrorMessage(err) || 'Failed to save changes')
    } finally {
      setSavingSection(null)
    }
  }

  // ---------- Work ----------
  const handleWorkChange = (field: keyof WorkFormValues, value: string) => {
    setWork((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleSaveWork = async () => {
    if (!profile || !work) return

    const cleaned: WorkFormValues = {
      job_title: work.job_title.trim(),
      department: work.department.trim(),
      timezone: work.timezone,
    }

    setWorkError(null)
    setSavingSection('work')
    try {
      await updateProfile({
        userId: profile.id,
        updates: {
          job_title: cleaned.job_title || null,
          department: cleaned.department || null,
          timezone: cleaned.timezone || null,
        },
      }).unwrap()
      setWork(cleaned)
    } catch (err) {
      setWorkError(getErrorMessage(err) || 'Failed to save changes')
    } finally {
      setSavingSection(null)
    }
  }

  // ---------- Render ----------
  if (profileError) {
    return (
      <p className="text-(--danger-text) text-sm font-semibold">
        {getErrorMessage(profileError) || 'Failed to load profile.'}
      </p>
    )
  }

  if (isLoading || !profile || !personal || !work) {
    return <p className="text-(--text-muted) text-sm">Loading profile...</p>
  }

  return (
    <>
        <div className=' mx-auto p-8 max-w-3xl '>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-(--text-primary) '>Profile</h1>
        <p className='text-md mt-1 text-(--text-secondary) '>This how others see you across the workspace.</p>
      </div>

      <div className='mb-10'>
      <ProfilePhotoCard
        firstName={profile.first_name}
        lastName={profile.last_name}
        avatarUrl={profile.avatar_url}
        uploading={uploading}
        removing={removing}
        error={photoError}
        onSelectFile={handleSelectAvatar}
        onRemove={handleRemoveAvatar}
      />
      </div>

      <div className='mb-10'>
      <PersonalInfoCard
        values={personal}
        onChange={handlePersonalChange}
        onSave={handleSavePersonal}
        saving={savingSection === 'personal'}
        dirty={personalDirty}
        error={personalError}
        lastUpdatedText={timeAgo(profile.updated_at)}
      />
      </div>

      <div className='mb-10'>
      <WorkDetailsCard
        values={work}
        onChange={handleWorkChange}
        onSave={handleSaveWork}
        saving={savingSection === 'work'}
        dirty={workDirty}
        error={workError}
      />
      </div>
    </div>
    </>
  )
}

export default ProfileSettingsPage