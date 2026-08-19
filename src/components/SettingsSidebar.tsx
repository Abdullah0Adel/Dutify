'use client'
import { createClient } from '@/lib/supabase/client'
import { redirect, useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div>

      <button onClick={() => redirect("/settings/themes")} className='bg-gray-400 p-5'> themes</button>

    <button 
      onClick={handleLogout}
      className='py-3 px-5 bg-red-700 text-white rounded-xl'
    >
      Logout
    </button>
    
    </div>
  )
}