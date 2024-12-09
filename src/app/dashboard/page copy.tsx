'use client';

import React, { useState } from 'react';
import { 
  PanelLeft, 
  Megaphone, 
  User, 
  FileText, 
  ChartBar,
  MapPin,
  Calendar,
  Bell,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Données pour les graphiques et statistiques
const campaignData = [
  { month: 'Jan', campagnes: 12 },
  { month: 'Fev', campagnes: 19 },
  { month: 'Mar', campagnes: 15 },
  { month: 'Avr', campagnes: 22 },
  { month: 'Mai', campagnes: 18 },
  { month: 'Juin', campagnes: 25 }
];

const panelOccupancyData = [
  { type: '12m²', taux: 65 },
  { type: 'Big Size', taux: 45 },
  { type: 'Petits', taux: 75 },
  { type: 'Bornes', taux: 55 }
];

// Composant de carte de statistiques
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
  <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
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
        className="text-primary-light w-12 h-12 opacity-50" 
      />
    </div>
    <div className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
      {change > 0 ? '↑' : '↓'} {Math.abs(change)}% depuis le mois dernier
    </div>
  </div>
);

// Widget Graphique des Campagnes
const CampaignsChart = () => (
  <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md h-[350px]">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        Évolution des Campagnes
      </h3>
      <Calendar className="text-neutral-500 dark:text-neutral-400" />
    </div>
    <ResponsiveContainer width="100%" height="85%">
      <BarChart data={campaignData}>
        <XAxis dataKey="month" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(30, 64, 175, 0.8)', 
            color: 'white',
            borderRadius: '8px'
          }} 
        />
        <Bar 
          dataKey="campagnes" 
          fill="#1E40AF" 
          className="transition-all duration-300 hover:opacity-80"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// Widget Occupation des Panneaux
const PanelOccupancyWidget = () => (
  <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md h-[350px]">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        Taux d'Occupation par Type
      </h3>
      <MapPin className="text-neutral-500 dark:text-neutral-400" />
    </div>
    <div className="space-y-4">
      {panelOccupancyData.map((item, index) => (
        <div key={index} className="flex items-center">
          <div className="w-1/3 text-neutral-600 dark:text-neutral-300">
            {item.type}
          </div>
          <div className="w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5 mx-4">
            <div 
              className="bg-primary-light h-2.5 rounded-full" 
              style={{ width: `${item.taux}%` }}
            />
          </div>
          <span className="text-neutral-500 dark:text-neutral-400">
            {item.taux}%
          </span>
        </div>
      ))}
    </div>
  </div>
);

// Widget Alertes et Notifications
const AlertsWidget = () => (
  <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md h-[350px] overflow-auto">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        Alertes et Notifications
      </h3>
      <Bell className="text-neutral-500 dark:text-neutral-400" />
    </div>
    {[
      { 
        icon: Activity, 
        title: 'Campagne Imminent', 
        description: 'La campagne "Total Guinée" se termine dans 2 semaines', 
        time: '2 heures' 
      },
      { 
        icon: MapPin, 
        title: 'Panneau Disponible', 
        description: '3 nouveaux panneaux 12m² libres à Conakry', 
        time: '5 heures' 
      },
      { 
        icon: User, 
        title: 'Nouveau Client', 
        description: 'Orange Guinée a rejoint notre plateforme', 
        time: '1 jour' 
      }
    ].map((alert, index) => (
      <div 
        key={index} 
        className="flex items-center p-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors mb-2"
      >
        <div className="bg-neutral-200 dark:bg-neutral-700 p-2 rounded-full mr-4">
          <alert.icon className="text-primary-light w-6 h-6" />
        </div>
        <div className="flex-grow">
          <h4 className="font-medium text-neutral-800 dark:text-neutral-200">
            {alert.title}
          </h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {alert.description}
          </p>
        </div>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {alert.time}
        </span>
      </div>
    ))}
  </div>
);

export default function DashboardHome() {
  return (
    <div className="space-y-6 p-6">
      {/* Statistiques principales */}
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
     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CampaignsChart />
        <PanelOccupancyWidget />
        <AlertsWidget />
      </div>
    </div>
  );
}