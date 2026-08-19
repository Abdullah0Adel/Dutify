'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

// تعريف الأنواع للـ Accent والـ Density
type DensityMode = 'comfortable' | 'compact';

interface CustomSettingsContextType {
  accent: string;
  density: DensityMode;
  changeAccent: (color: string) => void;
  changeDensity: (den: DensityMode) => void;
}

const CustomSettingsContext = createContext<CustomSettingsContextType | undefined>(undefined);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [accent, setAccent] = useState<string>('#6366f1');
  const [density, setDensity] = useState<DensityMode>('comfortable');

  useEffect(() => {
    // قراءة وتطبيق الـ Accent
    const savedAccent = localStorage.getItem('accent') || '#6366f1';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAccent(savedAccent);
    document.documentElement.style.setProperty('--accent-color', savedAccent);

    // قراءة وتطبيق الـ Density
    const savedDensity = (localStorage.getItem('density') as DensityMode) || 'comfortable';
    setDensity(savedDensity);
    document.documentElement.classList.remove('density-comfortable', 'density-compact');
    document.documentElement.classList.add(`density-${savedDensity}`);
  }, []);

  const changeAccent = (color: string) => {
    setAccent(color);
    localStorage.setItem('accent', color);
    document.documentElement.style.setProperty('--accent-color', color);
  };

  const changeDensity = (den: DensityMode) => {
    setDensity(den);
    localStorage.setItem('density', den);
    document.documentElement.classList.remove('density-comfortable', 'density-compact');
    document.documentElement.classList.add(`density-${den}`);
  };

  return (
    // 1. الـ ThemeProvider الخاص بمكتبة next-themes لـ المود (Dark/Light)
    <NextThemeProvider
      attribute="class" 
      defaultTheme="dark" 
      enableSystem
      scriptProps={{ dangerouslySetInnerHTML: { __html: '' } }}>
      {/* 2. الـ Context بتاعنا لباقي الإعدادات */}
      <CustomSettingsContext.Provider value={{ accent, density, changeAccent, changeDensity }}>
        {children}
      </CustomSettingsContext.Provider>
    </NextThemeProvider>
  );
}

// Hook مخصص لقراءة الإعدادات الإضافية
export const useCustomSettings = () => {
  const context = useContext(CustomSettingsContext);
  if (!context) throw new Error('useCustomSettings must be used within AppProviders');
  return context;
};