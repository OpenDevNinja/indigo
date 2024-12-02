"use client"
import React from 'react';

import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Breadcrumbs />
          <div className="mt-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}