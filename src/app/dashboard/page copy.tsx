import React from 'react';
import { 
  PanelLeft, 
  Megaphone, 
  User, 
  FileText 
} from 'lucide-react';

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change 
}: { 
  icon: React.ElementType, 
  title: string, 
  value: string, 
  change: number 
}) => (
  <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-neutral-500 dark:text-neutral-400 text-sm mb-2">
          {title}
        </h3>
        <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          {value}
        </p>
      </div>
      <Icon 
        className="text-primary w-12 h-12 opacity-50" 
      />
    </div>
    <div className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
      {change > 0 ? '↑' : '↓'} {Math.abs(change)}% depuis le mois dernier
    </div>
  </div>
);

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
        Tableau de Bord
      </h1> */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
  icon={PanelLeft}
  title="Total Panneaux"
  value="254"
  change={5.2}
/>
<StatCard 
  icon={Megaphone}
  title="Campagnes Actives"
  value="37"
  change={-2.1}
/>
<StatCard 
  icon={User}
  title="Nouveaux Clients"
  value="18"
  change={12.5}
/>
<StatCard 
  icon={FileText}
  title="Rapports Générés"
  value="126"
  change={8.3}
/>

      </div>

      {/* Additional dashboard widgets can be added here */}
    </div>
  );
}