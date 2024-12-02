'use client';

import { useState } from 'react';
import { PlusIcon, EyeIcon, CalendarIcon } from 'lucide-react';
import { campaignsData } from '@/lib/mock-data';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CampaignForm, { CampaignFormData } from '@/components/campaigns/CampaignForm';
import { v4 as uuidv4 } from 'uuid';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(campaignsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'À venir': return 'bg-yellow-100 text-yellow-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  
  const handleCampaignCreation = (newCampaign: CampaignFormData) => {
    const campaignToAdd = {
      ...newCampaign,
      id: uuidv4(),
      panelsUsed: 0, 
      totalReach: 0, 
      status: newCampaign.status === 'planifiée' ? 'À venir' : 
              newCampaign.status === 'en-cours' ? 'En cours' : 'Terminé'
    };
    setCampaigns([...campaigns, campaignToAdd]);
    closeModal();
  };
  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          Gestion des Campagnes
        </h1>
        <Button 
          variant="primary" 
          icon={<PlusIcon />}
          onClick={openModal}
        >
          Nouvelle Campagne
        </Button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              ✕
            </button>
            <CampaignForm 
              onSubmit={handleCampaignCreation}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Input 
            type="text"
            placeholder="Rechercher des campagnes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='dark:text-neutral-800'
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-700">
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-left">Date de Début</th>
              <th className="p-4 text-left">Date de Fin</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Panneaux</th>
              <th className="p-4 text-left">Portée</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((campaign) => (
              <tr 
                key={campaign.id} 
                className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <td className="p-4">{campaign.clientName}</td>
                <td className="p-4 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-neutral-500" />
                  {campaign.startDate}
                </td>
                <td className="p-4">{campaign.endDate}</td>
                <td className="p-4">
                  <span 
                    className={`
                      px-2 py-1 rounded-full text-xs 
                      ${getStatusColor(campaign.status)}
                    `}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="p-4">{campaign.panelsUsed}</td>
                <td className="p-4">{campaign.totalReach.toLocaleString()}</td>
                <td className="p-4 flex space-x-2">
                  <Button 
                    variant="ghost" 
                    icon={<EyeIcon className="w-4 h-4" />} 
                    aria-label="Détails"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}