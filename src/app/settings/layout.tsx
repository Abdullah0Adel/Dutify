// src/app/dashboard/settings/layout.tsx
'user client';
import SettingsSidebar from '@/components/SettingsSidebar';
import React from 'react';
// import SettingsSidebar from '@/components/SettingsSidebar';

// src/app/settings/(routes)/layout.tsx
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950">
      {/* Settings Sidebar */}
      <div className=''>
      <SettingsSidebar />
      </div>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}