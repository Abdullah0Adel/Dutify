// src/app/dashboard/settings/layout.tsx
'user client';
import SettingsSidebar from '@/components/SettingsSidebar';
import React from 'react';
// import SettingsSidebar from '@/components/SettingsSidebar';

// src/app/settings/(routes)/layout.tsx
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Settings Sidebar */}
      <SettingsSidebar />

      <div className='flex flex-col flex-1 h-full overflow-hidden min-w-0'>
      <main className="flex-1 overflow-y-auto bg-(--bg-primary)">
        {children}
      </main>
      </div>
    </div>
  );
}