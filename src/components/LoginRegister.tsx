'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

type Mode = 'login' | 'register';

const LoginRegister = () => {
    const router = useRouter(); // ضيف السطر ده هنا

  // 1. جعل الـ State هي المحرك الأساسي للشاشة، وتبدأ بـ 'login' كافتراضي
  const [mode, setMode] = useState<Mode>('login');
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [keepSigned, setKeepSigned] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error,setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  // 2. قراءة الحالة المحفوظة أول ما اليوزر يفتح الصفحة بأمان (Client-side)
  useEffect(() => {
    const savedForm = localStorage.getItem('form') as Mode;
    if (savedForm === 'login' || savedForm === 'register') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode(savedForm);
    }
  }, []);

  // 3. دالة ذكية للتنقل بتغير الـ State والـ localStorage مع بعض في نفس الوقت
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    localStorage.setItem('form', newMode);
    setError('')
  };

const handleSubmit = async () => {
  setLoading(true)
  setError('')
  const supabase = createClient()

  if (mode === 'register') {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { firstName, lastName } }
    })
    if (error) setError(error.message)
    else router.push('/dashboard')
  } else {
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })

    if (error) {
      setError(error.message)
    } else {
      // لو مش keepSigned، امسح الـ session لما يقفل المتصفح
      if (!keepSigned) {
        await supabase.auth.updateUser({})
        // خلي الـ session تنتهي مع إغلاق المتصفح
        localStorage.removeItem('supabase.auth.token')
      }
      router.push('/dashboard')
    }
  }



  setLoading(false)
}
  return (
    <div>
      <form className='flex flex-col gap-5 max-w-md md:min-w-md '  onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {/* header */}
        <div className=' max-w-md sm:max-w-md flex flex-col items-start'>
          <h1 className='text-2xl font-bold'>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className='text-[#6B6B8A] text-[14px]'>
            {mode === 'login' ? 'Sign in to your workspace' : 'Start managing your team'}
          </p>
        </div>

        {/* inputs */}
        <div className='flex flex-col gap-5  '>
          {/* Full Name inputs inside Register mode */}
          {mode === 'register' && (
            <div className='flex justify-between gap-6'>
              <div className='w-full flex flex-col gap-2'>
                <label className='text-xs font-semibold'>First name</label>
                <input 
                  type="text" 
                  placeholder='First Name' 
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className='flex items-center gap-2 border border-gray-300 dark:border-white/10 duration-300 hover:bg-[#7C5CFC]/10 hover:border-[#7C5CFC] dark:bg-[#1E1E2E] placeholder:text-[#868386] text-black dark:text-white py-3 px-4 rounded-xl w-full text-sm outline-none transition-all focus:shadow-[0_0_20px_rgb(124,92,252,0.3)]'
                />
              </div>
              <div className='w-full flex flex-col gap-2'>
                <label className='text-xs font-semibold'>Last name</label>
                <input 
                  type="text" 
                  placeholder='Last Name'
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className='flex items-center gap-2 border border-gray-300 dark:border-white/10 duration-300 hover:bg-[#7C5CFC]/10 hover:border-[#7C5CFC] dark:bg-[#1E1E2E] placeholder:text#868386] text-black dark:text-white py-3 px-4 rounded-xl w-full text-sm outline-none transition-all focus:shadow-[0_0_20px_rgb(124,92,252,0.3)]'
                />
              </div>
            </div>
          )}

          <div className='w-full flex flex-col gap-2'>
            <label className='text-xs font-semibold'>Email address</label>
            <input 
              type="text" 
              placeholder='email@work.com' 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='flex items-center gap-2 border border-gray-300 dark:border-white/10 duration-300 hover:bg-[#7C5CFC]/10 hover:border-[#7C5CFC] dark:bg-[#1E1E2E] placeholder:text-[#868386] text-black dark:text-white py-3 px-4 rounded-xl w-full text-sm outline-none transition-all focus:shadow-[0_0_20px_rgb(124,92,252,0.3)]'
            />
          </div>

          <div className='w-full flex flex-col gap-2'>
            <div className='flex items-baseline justify-between mb-1.5'>
              <label className='text-xs font-semibold'>Password</label>
              {mode === 'login' && <span className='text-[10px] text-[#7C5CFC] cursor-pointer hover:underline'>Forgot?</span>}
            </div>
            <input 
              type="password" 
              placeholder='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='flex items-center gap-2 border border-gray-300 dark:border-white/10 duration-300 hover:bg-[#7C5CFC]/10 hover:border-[#7C5CFC] dark:bg-[#1E1E2E] placeholder:text-[#868386] text-black dark:text-white py-3 px-4 rounded-xl w-full text-sm outline-none transition-all focus:shadow-[0_0_20px_rgb(124,92,252,0.3)]'
            />
          </div>

          {/* Checkbox التبديل الديناميكي */}
          {mode === 'login' ? (
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={keepSigned}
                onChange={(e) => setKeepSigned(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-150 ${keepSigned ? 'bg-[#7C5CFC] border-[#7C5CFC] shadow-[0_0_12px_rgba(124,92,252,0.4)]' : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'}`}>
                {keepSigned && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="white" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-[#6B6B8A] font-medium">Keep me signed in</span>
            </label>
          ) : (
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-150 ${isAgreed ? 'bg-[#7C5CFC] border-[#7C5CFC] shadow-[0_0_12px_rgba(124,92,252,0.4)]' : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'}`}>
                {isAgreed && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="white" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-[#6B6B8A] font-medium flex gap-1 items-center">
                I agree to 
                <span className='text-[#7C5CFC] text-sm font-bold border-b border-transparent hover:border-[#7C5CFC] cursor-pointer transition-colors duration-150'>Terms</span>
                & 
                <span className='text-[#7C5CFC] text-sm font-bold border-b border-transparent hover:border-[#7C5CFC] cursor-pointer transition-colors duration-150'>Privacy Policy</span>
              </span>
            </label>
          )}
        </div>

        {/* Button */}
        {error && <p className='text-red-400 text-xs text-center'>{error}</p>}
        <button 
        type='submit' 
        disabled={loading || (mode === 'register' && !isAgreed)}
        className={` text-white text-[14px] w-full flex items-center justify-center cursor-pointer
        gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] mb-4
        ${!isAgreed && mode === 'register' ? 'bg-[#7c5cfc7c]' : 'bg-[#7C5CFC]'}
        `}>
          {!isAgreed && mode === 'register' ? <Lock size={15} /> : ''}
          {loading ? 'Loaing...' : mode === 'login' ? 'Sign in' : 'Register'}
        </button>

        {/* Login Or Register link */}
        {mode === 'login' ? (
          <p className='text-xs text-[#6B6B8A] w-full text-center'>
            Don&apos;t have an Account?{' '}
            <span 
              onClick={() => handleModeChange('register')} 
              className='text-[#7C5CFC] text-lg font-bold border-b border-transparent hover:border-[#7C5CFC] cursor-pointer transition-colors duration-150'
            >
              Create one Free
            </span>
          </p>
        ) : (
          <p className='text-xs text-[#6B6B8A] w-full text-center'>
            Already have an account?{' '}
            <span 
              onClick={() => handleModeChange('login')} 
              className='text-[#7C5CFC] text-lg font-bold border-b border-transparent hover:border-[#7C5CFC] cursor-pointer transition-colors duration-150'
            >
              Sign in
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginRegister;