// src/app/page.tsx
'use client'
import React from 'react';
import Image from 'next/image';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LoginPage from './auth/login/page';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 shadow-md rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <Image 
            src="/logo-indigo-guinee.png" 
            alt="Indigo Guinée Logo" 
            width={120} 
            height={40} 
            className="dark:filter dark:invert"
          />
          <ThemeToggle />
        </div>
        <LoginPage/>
      </div>
    </div>
  );
}