'use client';

import { useTheme } from 'next-themes';
import { useCustomSettings } from '@/providers/AppProviders';
import { useEffect, useState } from 'react';

interface ColorOption {
  name: string;
  value: string;
}

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const { accent, density, changeAccent, changeDensity } = useCustomSettings();
  
  // تريكة مهمة: لمنع مشاكل الـ Hydration في الـ Client components مع next-themes
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const colors: ColorOption[] = [
    { name: 'purple', value: '#7C5CFC' },
    { name: 'teal', value: '#14b8a6' },
    { name: 'orange', value: '#f59e0b' },
    { name: 'pink', value: '#ec4899' },
    { name: 'blue', value: '#3b82f6' },
  ];

  return (
    <div className="p-8 max-w-3xl text-slate-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-1">Appearance</h2>
      <p className="text-sm text-slate-500 mb-6">Customize how Taskwise looks for you.</p>

{/* 1. قسم الـ Theme باستخدام next-themes */}
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
  <h3 className="font-semibold mb-4">Theme</h3>
  <div className="grid grid-cols-3 gap-4">
    {(['dark', 'light', 'system'] as const).map((mode) => (
      <button
        key={mode}
        onClick={() => setTheme(mode)}
        className={`p-4 rounded-xl border text-center capitalize flex flex-col items-center gap-2 transition-all cursor-pointer ${
          theme === mode 
            ? 'border-(--accent-color) bg-(--accent-color)/10 text-(--accent-color) font-bold' 
            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
        }`}
      >
        <span>{mode === 'dark' ? '🌙' : mode === 'light' ? '☀️' : '💻'}</span>
        {mode}
      </button>
    ))}
  </div>
</div>

      {/* 2. قسم الـ Accent Color */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
        <h3 className="font-semibold mb-2">Accent color</h3>
        <p className="text-xs text-slate-500 mb-4">Used for buttons, links, and highlights across the app</p>
        <div className="flex gap-4">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => changeAccent(color.value)}
              style={{ backgroundColor: color.value }}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
            >
              {accent === color.value && <span className="text-white text-xs">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 3. قسم الـ Display Density */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
        <h3 className="font-semibold mb-4">Display density</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'comfortable' as const, label: 'Comfortable', desc: 'More spacing, easier to read' },
            { id: 'compact' as const, label: 'Compact', desc: 'Denser layout, more visible' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => changeDensity(item.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                density === item.id 
                  ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10' 
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
              }`}
            >
              <div className={`font-semibold ${density === item.id ? 'text-[var(--accent-color)]' : ''}`}>{item.label}</div>
              <div className="text-xs text-slate-500">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}