'use client';
import React, { useState, useEffect } from 'react';
import { PlusIcon, Pencil, CalendarIcon, DownloadIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CampaignForm from '@/components/campaigns/CampaignForm';
import { CampaignService } from '@/services/campaignService';
import { Campaign, PaginatedResponse } from '@/types/type';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PAGE_SIZE = 10;

export default function CampaignsPage() {
  const [campaignData, setCampaignData] = useState<PaginatedResponse<Campaign>>({
    count: 0,
    next: null,
    previous: null,
    results: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    clientName: '',
    status: '',
    pays: '',
    commune: '',
    startDateFrom: '',
    startDateTo: ''
  });

  useEffect(() => {
    fetchCampaigns();
  }, [currentPage, filters]); // Refetch when page or filters change

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        page_size: PAGE_SIZE.toString()
      });

      // Add filters to query params if they exist
      if (filters.clientName) {
        queryParams.append('customer__fullname', filters.clientName);
      }
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      if (filters.startDateFrom) {
        queryParams.append('start_date_gte', filters.startDateFrom);
      }
      if (filters.startDateTo) {
        queryParams.append('end_date_lte', filters.startDateTo);
      }

      const response = await CampaignService.getAll(queryParams);
      
      // Sort by created_at date in descending order
      const sortedResults = [...response.results].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setCampaignData({
        ...response,
        results: sortedResults
      });
    } catch (error) {
      console.error('Erreur lors du chargement des campagnes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignCreate = async (campaignData: any) => {
    try {
      await CampaignService.create(campaignData);
      setIsModalOpen(false);
      // Reset to first page and refetch
      setCurrentPage(1);
      fetchCampaigns();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleCampaignUpdate = async (campaignData: any) => {
    try {
      if (editingCampaign) {
        await CampaignService.update(editingCampaign.id, campaignData);
        setIsModalOpen(false);
        setEditingCampaign(null);
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const totalPages = Math.ceil(campaignData.count / PAGE_SIZE);

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
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Liste des Campagnes', 14, 22);

    const tableColumn = [
      'Client',
      'Date Début',
      'Date Fin',
      'Code Panneaux',
      'Quantité',
      'Temps Restant',
      'Créé par'
    ];
    
    const tableRows = campaignData.results.map(campaign => [
      campaign.customer.fullname,
      campaign.start_date,
      campaign.end_date,
      campaign.panel.map(p => p.panel.code).join(', '),
      campaign.panel.reduce((sum, p) => sum + p.quantity, 0),
      campaign.time_remaining,
      campaign.user.email
    ]);

    (doc as any).autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });

    doc.save('liste_campagnes.pdf');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

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

      <div className="bg-white text-bg-neutral-800 dark:bg-neutral-800 rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Input
          type="text"
          name="clientName"
          placeholder="Client"
          value={filters.clientName}
          onChange={handleFilterChange}
          className="dark:text-neutral-800"
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
          type="date"
          name="startDateFrom"
          placeholder="Date de début (de)"
          value={filters.startDateFrom}
          onChange={handleFilterChange}
          className="dark:text-neutral-800"
        />
        <Input
          type="date"
          name="startDateTo"
          placeholder="Date de début (à)"
          value={filters.startDateTo}
          onChange={handleFilterChange}
          className="dark:text-neutral-800"
        />
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-100 dark:bg-neutral-700">
                <th className="p-4 text-left">Client</th>
                <th className="p-4 text-left">Date de Début</th>
                <th className="p-4 text-left">Date de Fin</th>
                <th className="p-4 text-left">Code Panneaux</th>
                <th className="p-4 text-left">Quantité</th>
                <th className="p-4 text-left">Temps Restant</th>
                <th className="p-4 text-left">Créé par</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaignData.results.map((campaign) => (
                <tr 
                  key={campaign.id}
                  className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  <td className="p-4">{campaign.customer.fullname}</td>
                  <td className="p-4 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-neutral-500" />
                    {campaign.start_date}
                  </td>
                  <td className="p-4">{campaign.end_date}</td>
                  <td className="p-4">{campaign.panel.map(p => p.panel.code).join(', ')}</td>
                  <td className="p-4">{campaign.panel.reduce((sum, p) => sum + p.quantity, 0)}</td>
                  <td className="p-4">{campaign.time_remaining}</td>
                  <td className="p-4">{campaign.user.email}</td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      icon={<Pencil className="w-4 h-4" />}
                      aria-label="Modifier"
                      onClick={() => {
                        setEditingCampaign(campaign);
                        setIsModalOpen(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {campaignData.results.length === 0 && (
          <div className="text-center p-4 text-neutral-500">
            Aucune campagne trouvée
          </div>
        )}

        <div className="flex justify-center items-center space-x-2 p-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button
            variant="secondary"
            icon={<ChevronLeft className="w-4 h-4" />}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!campaignData.previous}
          >
            Précédent
          </Button>
          <span className="text-neutral-600 dark:text-neutral-300">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="secondary"
            icon={<ChevronRight className="w-4 h-4" />}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!campaignData.next}
          >
            Suivant
          </Button>
        </div>
      </div>

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
              initialData={editingCampaign }
              onSubmit={editingCampaign ? handleCampaignUpdate : handleCampaignCreate}
              onCancel={() => {
                setIsModalOpen(false);
                setEditingCampaign(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}