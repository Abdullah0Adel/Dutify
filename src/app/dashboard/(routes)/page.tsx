import { cookies } from 'next/headers';
import React from 'react';
import { redirect } from "next/navigation";
import DashboardHeader from '@/components/DashboardHeader';
import DashboardBody from '@/components/DashboardBody';

export default async function Page() {

    // 1. جلب الـ Token على السيرفر مباشرة بأمان
  const cookieStore = await cookies()
  const token = cookieStore.get('sb-gbjdcfiylxddyscezwuo-auth-token')?.value

  // 2. التحقق فوري: لو مفيش توكن، حوّله لصفحة الـ login قبل ما الـ HTML يتبعت أصلاً!
  if (!token) {
    redirect("/login");;
  }

  // الكود ده مش هيتشاف ولا هيتنفذ لو مفيش توكن
  // console.log("Token found:", token)  


  return (
    <div className="bg-(--bg-primary) h-screen ">

      {/* Dashboard Header */}
      <DashboardHeader/>

      <DashboardBody/>
    </div>
  );
}