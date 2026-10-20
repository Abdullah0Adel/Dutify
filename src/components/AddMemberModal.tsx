'use client'

import React, { useState } from 'react'
import type { ProjectMemberWithUser } from '@/lib/supabase/types'
import type { AppUser } from '@/lib/store/api'

interface AddMemberModalProps {
  isOpen: boolean
  members: ProjectMemberWithUser[]
  allUsers: AppUser[]
  memberIds: Set<string>
  currentUserId: string | null
  loadingMembers: boolean
  loadingUsers: boolean
  addingUserId: string | null
  removingUserId: string | null
  error: string | null
  onClose: () => void
  onAdd: (userId: string, role: string) => void
  onRemove: (userId: string) => void
}

const AddMemberModal = ({
  isOpen,
  members,
  allUsers,
  memberIds,
  currentUserId,
  loadingMembers,
  loadingUsers,
  addingUserId,
  removingUserId,
  error,
  onClose,
  onAdd,
  onRemove,
}: AddMemberModalProps) => {
  const [role, setRole] = useState('member')
  const [search, setSearch] = useState('')

  if (!isOpen) return null

  // فلترة كل اليوزرز بالاسم
  const query = search.trim().toLowerCase()
  const filteredUsers = allUsers.filter((u) =>
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(query)
  )

  // أي عملية شغالة دلوقتي (add أو remove) نقفل باقي الزراير
  const isBusy = addingUserId !== null || removingUserId !== null

  const handleClose = () => {
    setSearch('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl p-6 space-y-6"
        style={{ backgroundColor: 'var(--bg-primary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-(--text-primary) font-semibold text-lg">
            Manage Members
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-(--text-secondary) text-sm cursor-pointer"
          >
            Close
          </button>
        </div>

        {error && (
          <p className="text-(--danger-text) text-xs font-medium">{error}</p>
        )}

        {/* ---------- Current Members ---------- */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-(--text-secondary) text-xs font-semibold uppercase">
              Current Members
            </h3>
            <span className="text-(--text-muted) text-xs">{members.length}</span>
          </div>

          {loadingMembers ? (
            <p className="text-(--text-muted) text-sm">Loading members...</p>
          ) : members.length === 0 ? (
            <p className="text-(--text-muted) text-sm">No members yet.</p>
          ) : (
            <ul className="space-y-2">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border px-3 py-2 border-(--border-color)"
                >
                  <div className="flex flex-col">
                    <span className="text-(--text-primary) text-sm">
                      {m.user?.first_name} {m.user?.last_name}
                    </span>
                    <span className="text-(--text-muted) text-xs capitalize">
                      {m.role}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(m.user_id)}
                    disabled={isBusy || m.user_id === currentUserId}
                    title={
                      m.user_id === currentUserId
                        ? "You can't remove yourself"
                        : undefined
                    }
                    className="text-(--danger-text) border border-(--danger-text) font-semibold text-xs px-3 py-1.5 rounded-lg hover:opacity-80 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {removingUserId === m.user_id ? 'Removing...' : 'Remove'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ---------- All Users ---------- */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-(--text-secondary) text-xs font-semibold uppercase ">
              All Users
            </h3>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg border px-2 py-1 text-xs bg-transparent text-(--text-primary) outline-none border-(--border-color)"
            >
              <option value="member" className='rounded-lg border px-2 py-1 text-xs bg-transparent text-(--text-primary) outline-none'>Add as Member</option>
              <option value="admin" className='rounded-lg border px-2 py-1 text-xs bg-transparent text-(--text-primary) outline-none'>Add as Admin</option>
            </select>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full rounded-xl border border-(--border-color) px-3 py-2 text-sm bg-transparent text-(--text-primary) outline-none"
          />

          {loadingUsers ? (
            <p className="text-(--text-muted) text-sm">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-(--text-muted) text-sm">
              {allUsers.length === 0
                ? 'No users found.'
                : 'No users match your search.'}
            </p>
          ) : (
            <ul className="space-y-2">
              {filteredUsers.map((u) => {
                const isMember = memberIds.has(u.id)

                return (
                  <li
                    key={u.id}
                    className="flex items-center justify-between rounded-xl border px-3 py-2 border-(--border-color)"
                  >
                    <span className="text-(--text-primary) text-sm">
                      {u.first_name} {u.last_name}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAdd(u.id, role)}
                      disabled={isBusy || isMember}
                      className="bg-(--accent-color) text-white font-semibold text-xs px-3 py-1.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isMember
                        ? 'Added'
                        : addingUserId === u.id
                        ? 'Adding...'
                        : 'Add'}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default AddMemberModal