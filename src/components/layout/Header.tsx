import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import Input from '../ui/Input';
import ThemeToggle from '../ui/ThemeToggle';

export default function Header() {
  return (
    <header className="bg-white dark:bg-neutral-800 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="w-1/3 ">
          <Input 
            type="text" 
            placeholder="Recherche globale" 
         /*    icon={<Search className="text-neutral-400 " />}
             */
            className=" dark:text-neutral-800" 
          />
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button 
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 relative"
            aria-label="Notifications"
          >
            <Bell className="text-neutral-600 dark:text-neutral-300" />
            <span 
              className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"
            />
          </button>
          <button 
            className="flex items-center space-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 p-2 rounded-lg"
            aria-label="Profile"
          >
            <User className="text-neutral-600 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-200">
              John Doe
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}