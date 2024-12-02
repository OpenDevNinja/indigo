import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HomeIcon, 
  PanelLeft, 
  Megaphone, 
  User, 
  FileText, 
  SettingsIcon 
} from 'lucide-react';

const menuItems = [
  { 
    name: 'Tableau de Bord', 
    icon: HomeIcon, 
    href: '/dashboard' 
  },
  { 
    name: 'Panneaux', 
    icon: PanelLeft, 
    href: '/dashboard/panels' 
  },
  { 
    name: 'Campagnes', 
    icon: Megaphone, 
    href: '/dashboard/campaigns' 
  },
  { 
    name: 'Clients', 
    icon: User, 
    href: '/dashboard/clients' 
  },
  { 
    name: 'Rapports', 
    icon: FileText, 
    href: '/dashboard/reports' 
  },
  { 
    name: 'Configuration', 
    icon: SettingsIcon, 
    href: '/dashboard/settings' 
  }
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside 
      className={`bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 
        transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}
    >
      <div className="flex items-center justify-between p-4">
        <h1 className={`text-xl font-bold ${!isExpanded && 'hidden'}`}>
          Indigo Guinée
        </h1>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          {isExpanded ? '←' : '→'}
        </button>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link 
            key={item.name}
            href={item.href}
            className="flex items-center p-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 
              transition-colors group"
          >
            <item.icon 
              className="text-neutral-600 dark:text-neutral-300 
                group-hover:text-primary transition-colors"
            />
            <span 
              className={`ml-4 ${!isExpanded && 'hidden'} 
                text-neutral-700 dark:text-neutral-200`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}