'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
 

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="text-neutral-600 dark:text-neutral-300" />
      ) : (
        <Sun className="text-neutral-600 dark:text-neutral-300" />
      )}
    </button>
  );
}
