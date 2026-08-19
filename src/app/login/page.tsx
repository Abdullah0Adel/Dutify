import LoginRegister from '@/components/LoginRegister'
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";


export default async function LoginPage() {

    const cookieStore = await cookies();
    const token = cookieStore.get('sb-gbjdcfiylxddyscezwuo-auth-token')?.value;
  
    // 2. التحقق فوري: لو مفيش توكن، حوّله لصفحة الـ login قبل ما الـ HTML يتبعت أصلاً!
    if (token) {
      redirect("/dashboard");
    }


  return (
    <div className='flex justify-center items-center '>

<div className='min-h-screen w-[45%] bg-[#7C5CFC] hidden md:flex flex-col justify-between p-10 relative overflow-hidden'>
  
  {/* الدوائر الزخرفية */}
  <div className='absolute top-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full bg-white/10' />
  <div className='absolute top-[60px] left-[60px] w-[200px] h-[200px] rounded-full bg-white/10' />
  <div className='absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full bg-white/10' />
  <div className='absolute bottom-[120px] right-[80px] w-[200px] h-[200px] rounded-full bg-white/10' />

  {/* Logo */}
  <div className='relative z-10 flex items-center gap-2'>
    <div className='w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center'>
      <div className='w-4 h-4 rounded-full bg-white' />
    </div>
    <span className='text-white font-bold text-lg'>Taskwise</span>
  </div>

  {/* المحتوى */}
  <div className='relative z-10'>
    <p className='text-white/60 text-xs font-semibold tracking-widest uppercase mb-4'>Your personal command center</p>
    <h1 className='text-white text-4xl font-extrabold leading-tight mb-4'>
      Do more.<br />Stress less.
    </h1>
    <p className='text-white/70 text-sm leading-relaxed mb-8'>
      Taskwise helps you stay focused — not buried in noise. Organized, clear, and always a step ahead.
    </p>
    <div className='flex flex-col gap-3'>
      {['Surfaces your most important work every morning.', 'Track completion rate and celebrate wins.', 'Smart reminders — never miss a deadline.'].map((item) => (
        <div key={item} className='flex items-center gap-3'>
          <div className='w-1.5 h-1.5 rounded-full bg-white/60' />
          <span className='text-white/80 text-sm'>{item}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Testimonial */}
  <div className='relative z-10 bg-white/10 rounded-2xl p-5'>
    <p className='text-white/90 text-sm italic mb-3'>&quot;Taskwise changed how our team works. Nothing slips through the cracks.&quot;</p>
    <div className='flex items-center gap-3'>
      <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold'>SL</div>
      <div>
        <p className='text-white text-xs font-semibold'>Sara Lin</p>
        <p className='text-white/60 text-xs'>Head of Product, Meridian</p>
      </div>
    </div>
  </div>

</div>
    <div className='flex-1 flex  items-center justify-center px-5 sm:px-8 py-6 lg:py-10 dark:bg-[#0b0b12]'>
      {/* ------------Login Form------------ */}
      <LoginRegister/>
    </div>
    </div>
  )
}