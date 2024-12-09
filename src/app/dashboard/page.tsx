'use client';
import React, { useState,  } from 'react';
import { 
  Download, 
  PanelLeft, 
  Users, 
  Table, 
  BarChart, 
  MapPin, 
  FileSpreadsheet 
} from 'lucide-react';
import Chart from '@/components/ui/Chart';

// Mock Data (you can replace with actual data fetching logic)
const dashboardData = {
  totalPanels: 254,
  availablePanels: 126,
  occupiedPanels: 128,
  activeCampaigns: 37,
  availableSoonPanels: 22,
  totalClients: 45,
  activeClients: 18
};

const PanelDashboard = () => {
  const [selectedExportType, setSelectedExportType] = useState('all');

  const exportReport = () => {
    // Implement export logic 
    // This would typically involve calling an API endpoint to generate an Excel file
    alert(`Exporting ${selectedExportType} panel report`);
  };

  const exportOptions = [
    { value: 'all', label: 'Tous les Panneaux' },
    { value: 'country', label: 'Par Pays' },
    { value: 'commune', label: 'Par Pays et Commune' }
  ];

  return (
    <div className="p-6 bg-neutral-50 dark:bg-neutral-900 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">
          Tableau de Bord des Panneaux
        </h1>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              icon: <PanelLeft className="text-blue-500" />, 
              label: 'Total des Panneaux', 
              value: dashboardData.totalPanels 
            },
            { 
              icon: <MapPin className="text-green-500" />, 
              label: 'Panneaux Disponibles', 
              value: dashboardData.availablePanels 
            },
            { 
              icon: <Table className="text-yellow-500" />, 
              label: 'Panneaux Occupés', 
              value: dashboardData.occupiedPanels 
            },
            { 
              icon: <BarChart className="text-purple-500" />, 
              label: 'Campagnes en Cours', 
              value: dashboardData.activeCampaigns 
            },
            { 
              icon: <MapPin className="text-orange-500" />, 
              label: 'Panneaux Bientôt Disponibles', 
              value: dashboardData.availableSoonPanels 
            },
            { 
              icon: <Users className="text-teal-500" />, 
              label: 'Total Clients', 
              value: dashboardData.totalClients 
            }
          ].map((metric, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow"
            >
              <div className="p-3 bg-neutral-100 dark:bg-neutral-700 rounded-full">
                {metric.icon}
              </div>
              <div>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                  {metric.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Export Section */}
        <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
            Exporter Rapport des Panneaux
          </h2>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedExportType}
              onChange={(e) => setSelectedExportType(e.target.value)}
              className="p-2 border rounded dark:bg-neutral-700 dark:border-neutral-600"
            >
              {exportOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button 
              onClick={exportReport}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              <Download size={18} />
              <span>Exporter</span>
            </button>
          </div>
        </div>
      </div>
      <Chart/>
    </div>
  );
};

export default PanelDashboard;