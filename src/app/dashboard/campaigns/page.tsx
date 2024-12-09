'use client';

import { useState } from 'react';
import { PlusIcon, Pencil, CalendarIcon, DownloadIcon } from 'lucide-react';
import { campaignsData, Campaign, clientsData,CampaignFormData } from '@/lib/mock-data';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CampaignForm from '@/components/campaigns/CampaignForm';
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(campaignsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [filters, setFilters] = useState({
    clientName: '',
    status: '',
    pays: '',
    commune: '',
    startDateFrom: '',
    startDateTo: ''
  });

  const filteredCampaigns = campaigns.filter(campaign => 
    (!filters.clientName || campaign.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) &&
    (!filters.status || campaign.status === filters.status) &&
    (!filters.pays || campaign.pays?.toLowerCase().includes(filters.pays.toLowerCase())) &&
    (!filters.commune || campaign.commune?.toLowerCase().includes(filters.commune.toLowerCase())) &&
    (!filters.startDateFrom || campaign.startDate >= filters.startDateFrom) &&
    (!filters.startDateTo || campaign.startDate <= filters.startDateTo)
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'À venir': return 'bg-yellow-100 text-yellow-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };
  const exportToPDF = () => {
    // Créer un nouveau document PDF
    const doc = new jsPDF();
    
    // Titre du document
    doc.setFontSize(18);
    doc.text('Liste des Campagnes', 14, 22);

    // Préparer les données pour la table
    const tableColumn = [
      'Client', 
      'Campagne', 
      'Date de Début', 
      'Date de Fin', 
      'Statut', 
      'Panneaux',
      'Pays',
      'Commune'
    ];
    
    const tableRows = filteredCampaigns.map(campaign => [
      campaign.clientName,
      campaign.campaignName,
      campaign.startDate,
      campaign.endDate,
      campaign.status,
      campaign.panelsUsed.toString(),
      campaign.pays || 'N/A',
      campaign.commune || 'N/A'
    ]);

    // Ajouter la table au document
    (doc as any).autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      styles: { 
        fontSize: 8,
        cellPadding: 3 
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255 
      }
    });

    // Enregistrer le document
    doc.save('liste_campagnes.pdf');
  };
 const handleCampaignCreation = (campaignData: CampaignFormData) => {
  const newCampaign: Campaign = {
    id: uuidv4(),
    ...campaignData,
    status: campaignData.status === 'Normal' ? 'Normal' : campaignData.status as Campaign['status'],
    panelsUsed: campaignData.panelGroups.length,
    pays: campaignData.panelGroups[0]?.pays || '',
    commune: campaignData.panelGroups[0]?.commune || '',
  };

  setCampaigns([...campaigns, newCampaign]);
  setIsModalOpen(false);
};

const handleCampaignUpdate = (campaignData: CampaignFormData) => {
  const existingCampaign = campaigns.find(c => c.id === editingCampaign?.id);

  if (existingCampaign) {
    const updatedCampaign: Campaign = {
      ...existingCampaign,
      ...campaignData,
      status: campaignData.status === 'Normal' ? 'Normal' : campaignData.status as Campaign['status'],
      panelsUsed: campaignData.panelGroups.length,
      pays: campaignData.panelGroups[0]?.pays ?? existingCampaign.pays,
      commune: campaignData.panelGroups[0]?.commune ?? existingCampaign.commune,
    };

    setCampaigns(campaigns.map(campaign => 
      campaign.id === updatedCampaign.id ? updatedCampaign : campaign
    ));
    setEditingCampaign(null);
    setIsModalOpen(false);
  }
};
  const openEditModal = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 relative">
     <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          Gestion des Campagnes
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            icon={<DownloadIcon />}
            onClick={exportToPDF}
          >
            Exporter PDF
          </Button>
          <Button 
            variant="primary" 
            icon={<PlusIcon />}
            onClick={() => {
              setEditingCampaign(null);
              setIsModalOpen(true);
            }}
          >
            Nouvelle Campagne
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white text-bg-neutral-800 dark:bg-neutral-800 rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Input
          type="text"
          name="clientName"
          placeholder="Client"
          value={filters.clientName}
          onChange={handleFilterChange}
          className='dark:text-neutral-800'
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded dark:bg-neutral-800"
        >
          <option value="">Tous les statuts</option>
          <option value="Normal">Normal</option>
          <option value="Annulé">Annulé</option>
          <option value="En cours">En cours</option>
          <option value="À venir">À venir</option>
          <option value="Terminé">Terminé</option>
        </select>
        <Input
          type="text"
          name="pays"
          placeholder="Pays"
          value={filters.pays}
          onChange={handleFilterChange}
           className='dark:text-neutral-800'
        />
        <Input
          type="text"
          name="commune"
          placeholder="Commune"
          value={filters.commune}
          onChange={handleFilterChange}
           className='dark:text-neutral-800'
        />
        <Input
          type="date"
          name="startDateFrom"
          placeholder="Date de début (de)"
          value={filters.startDateFrom}
          onChange={handleFilterChange}
           className='dark:text-neutral-800'
        />
        <Input
          type="date"
          name="startDateTo"
          placeholder="Date de début (à)"
          value={filters.startDateTo}
          onChange={handleFilterChange}
           className='dark:text-neutral-800'
        />

      </div>

      {/* Modal for Campaign Form */}
    {/* Modal for Campaign Form */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
      <button 
        onClick={() => {
          setIsModalOpen(false);
          setEditingCampaign(null);
        }}
        className="absolute top-4 right-4 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        ✕
      </button>
      <CampaignForm 
      initialCampaign={editingCampaign || undefined}
      onSubmit={editingCampaign ? handleCampaignUpdate : handleCampaignCreation}
      onCancel={() => {
        setIsModalOpen(false);
        setEditingCampaign(null);
      }}
    />
    </div>
  </div>
)}

      {/* Campaigns Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-700">
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-left">Campagne</th>
              <th className="p-4 text-left">Date de Début</th>
              <th className="p-4 text-left">Date de Fin</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Panneaux</th>
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
                <td className="p-4">{campaign.campaignName}</td>
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
                
                <td className="p-4 flex space-x-2">
                  <Button 
                    variant="ghost" 
                    icon={<Pencil className="w-4 h-4" />} 
                    aria-label="Détails"
                    onClick={() => openEditModal(campaign)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCampaigns.length === 0 && (
          <div className="text-center p-4 text-neutral-500">
            Aucune campagne trouvée
          </div>
        )}
      </div>
    </div>
  );
}