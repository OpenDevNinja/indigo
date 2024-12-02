'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useCustomTheme } from '@/hooks/useColorMode'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useCustomTheme()

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
    >
      {theme === 'light' ? (
        <Moon className="text-neutral-600" />
      ) : (
        <Sun className="text-neutral-300" />
      )}
    </button>
  )
}