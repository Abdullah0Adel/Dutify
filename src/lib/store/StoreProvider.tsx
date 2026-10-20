/* eslint-disable react-hooks/refs */
'use client'

import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from './store'
import { baseApi } from './api/baseApi'
import { createClient } from '@/lib/supabase/client'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    const store = storeRef.current!
    const supabase = createClient()

    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Tasks' },
        () => store.dispatch(baseApi.util.invalidateTags(['Tasks']))
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Projects' },
        () => store.dispatch(baseApi.util.invalidateTags(['Projects']))
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'project_members' },
        () => store.dispatch(baseApi.util.invalidateTags(['Members']))
      )
      .subscribe()

    // عند الـ logout امسح الـ cache عشان بيانات اليوزر القديم ماتظهرش للي بعده
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        store.dispatch(baseApi.util.resetApiState())
      }
    })

    return () => {
      supabase.removeChannel(channel)
      subscription.unsubscribe()
    }
  }, [])

  // eslint-disable-next-line react-hooks/refs
  return <Provider store={storeRef.current}>{children}</Provider>
}