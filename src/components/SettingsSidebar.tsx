'use client'

import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, ChevronRight, Lock, Menu, Palette, User, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { usePathname } from 'next/navigation';


export default function SettingsSidebar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }
  const pathname = usePathname();
  console.log(pathname)


  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className='md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl dark:bg-[#0b0b12] bg-white shadow-lg border border-white/10'
      >
        <Menu size={20} className='text-[#777795]' />
      </button>

      {/* Overlay - mobile only */}
      {isOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-50 md:z-auto
          h-full overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className='w-63.75 px-3 py-8 flex flex-col gap-5 h-full dark:bg-[#0b0b12] border-r dark:border-slate-800 overflow-y-auto'>

          <button 
          onClick={() => router.push('/dashboard?filter=all')}
          className='flex justify-start items-center py-2 px-6 rounded-2xl bg-transparent hover:bg-(--bg-hover) dark:hover:bg-[#1A1A28] transition duration-300 '>
            <ArrowLeft  />
            <p className='ml-5'>Back to tasks</p>
          </button>

          <div className='flex flex-col gap-1 justify-start'>
            <h1 className='text-(--text-primary) text-2xl '>Settings</h1>
            <p className='text-(--text-secondary) text-sm'>Manage your account</p>
          </div>


            <button
              onClick={() => router.push('/settings')}
                className={`w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-2xl text-left transition-all duration-500 cursor-pointer
                  ${pathname === '/settings' ? 'bg-(--accent-color) dark:bg-(--accent-color) ' : 'hover:bg-(--accent-color)/15 '}`}
              >
                <div className='flex items-center gap-3'>
                  <User size={20} className={pathname === '/settings' ? 'text-white' : 'text-[#777795]'} />
                  <div className='flex flex-col '>
                    <h3 className={`font-bold text-[13px] ${pathname === '/settings' ? 'text-white' : 'text-black dark:text-white'}`}>Profile</h3>
                    <p className={` text-[11px] ${pathname === '/settings' ? 'text-white' : 'text-black dark:text-white'}`}>Name, bio</p>
                  </div>
                </div>
                {pathname === '/settings' && (
                  <div className='w-5 h-5 bg-white text-(--accent-color) dark:text-white dark:bg-black/20 flex text-[12px] font-bold justify-center items-center rounded-full'>
                    <ChevronRight />
                  </div>
                )}
              </button>

              <button
              onClick={() => router.push('/settings/account')}
                className={`w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-2xl text-left transition-all duration-500 cursor-pointer
                  ${pathname === '/settings/account' ? 'bg-(--accent-color) dark:bg-(--accent-color) ' : 'hover:bg-(--accent-color)/15 '}`}
              >
                <div className='flex items-center gap-3'>
                  <Lock size={20} className={pathname === '/settings/account' ? 'text-white' : 'text-[#777795]'} />
                  <div className='flex flex-col '>
                    <h3 className={`font-bold text-[13px] ${pathname === '/settings/account' ? 'text-white' : 'text-black dark:text-white'}`}>Appearance</h3>
                    <p className={` text-[11px] ${pathname === '/settings/account' ? 'text-white' : 'text-black dark:text-white'}`}>Email, password</p>
                  </div>
                </div>
                {pathname === '/settings/account' && (
                  <div className='w-5 h-5 bg-white text-(--accent-color) dark:text-white dark:bg-black/20 flex text-[12px] font-bold justify-center items-center rounded-full'>
                    <ChevronRight />
                  </div>
                )}
              </button>


              <button
              onClick={() => router.push('/settings/themes')}
                className={`w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-2xl text-left transition-all duration-500 cursor-pointer
                  ${pathname === '/settings/themes' ? 'bg-(--accent-color) dark:bg-(--accent-color) ' : 'hover:bg-(--accent-color)/15 '}`}
              >
                <div className='flex items-center gap-3'>
                  <Palette size={20} className={pathname === '/settings/themes' ? 'text-white' : 'text-[#777795]'} />
                  <div className='flex flex-col '>
                    <h3 className={`font-bold text-[13px] ${pathname === '/settings/themes' ? 'text-white' : 'text-black dark:text-white'}`}>Appearance</h3>
                    <p className={` text-[11px] ${pathname === '/settings/themes' ? 'text-white' : 'text-black dark:text-white'}`}>Theme, layout</p>
                  </div>
                </div>
                {pathname === '/settings/themes' && (
                  <div className='w-5 h-5 bg-white text-(--accent-color) dark:text-white dark:bg-black/20 flex text-[12px] font-bold justify-center items-center rounded-full'>
                    <ChevronRight />
                  </div>
                )}
              </button>




          {/* Spacer */}
          <div className='flex-1' />

          <div>



            <button
              onClick={handleLogout}
              className='py-3 px-5 bg-red-700 text-white rounded-xl'
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
