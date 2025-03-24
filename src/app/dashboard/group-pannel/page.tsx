"use client"
import { useState, useEffect } from 'react';
import { PlusIcon, EditIcon, TrashIcon, DownloadIcon } from 'lucide-react';
import { PanelGroup, PaginatedResponse } from '@/types/type';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PanelGroupForm, { PanelGroupFormData } from '@/components/panels/PanelGroupForm';
import { Toaster, toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useRouter } from 'next/navigation';
import { PanelGroupService } from '@/services/pannelGroup';
import Swal from 'sweetalert2';

export default function PanelGroupPage() {
  const [panelGroups, setPanelGroups] = useState<PanelGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<PanelGroup | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  }>({
    count: 0,
    next: null,
    previous: null
  });
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }
    fetchPanelGroups(currentPage);
  }, [currentPage]);

  const fetchPanelGroups = async (page: number) => {
    try {
      setLoading(true);
      const response: PaginatedResponse<PanelGroup> = await PanelGroupService.getAll(page);
      
      // Sort groups by creation date (newest first)
      const sortedGroups = [...response.results].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setPanelGroups(sortedGroups);
      setPaginationInfo({
        count: response.count,
        next: response.next,
        previous: response.previous
      });
      setTotalPages(Math.ceil(response.count / itemsPerPage));
    } catch (error) {
      toast.error('Impossible de charger les groupes de panneaux');
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = panelGroups.filter(group =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const openModal = (group?: PanelGroup) => {
    setSelectedGroup(group || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  const handlePanelGroupSubmit = async (formData: PanelGroupFormData) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const groupData = {
          name: formData.name.trim()
        };
        let response;
        if (selectedGroup) {
          response = await PanelGroupService.update(selectedGroup.id, groupData);
        } else {
          response = await PanelGroupService.create(groupData);
        }
        if (response) {
          // Always refresh the first page after adding/updating a group
          await fetchPanelGroups(1);
          setCurrentPage(1);
          closeModal();
          resolve(response);
        } else {
          reject(new Error('Pas de réponse de l\'API'));
        }
      } catch (error: any) {
        console.error('Erreur détaillée:', error.response?.data || error);
        reject(error);
      }
    });
    toast.promise(promise, {
      loading: 'Enregistrement en cours...',
      success: selectedGroup ? 'Groupe mis à jour avec succès' : 'Groupe créé avec succès',
      error: (err) => `Erreur: ${err?.response?.data?.detail || err.message || 'Une erreur est survenue'}`
    });
  };

  const handleDeleteGroup = async (id: string) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const promise = new Promise(async (resolve, reject) => {
          try {
            await PanelGroupService.delete(id);
            // Reload current page, or go back a page if empty
            const pageToLoad = panelGroups.length > 1 ? currentPage : Math.max(1, currentPage - 1);
            await fetchPanelGroups(pageToLoad);
            setCurrentPage(pageToLoad);
            resolve(true);
          } catch (error) {
            reject(error);
          }
        });
        toast.promise(promise, {
          loading: 'Suppression en cours...',
          success: 'Groupe supprimé avec succès',
          error: 'Impossible de supprimer le groupe'
        });
        Swal.fire(
          'Supprimé!',
          'Le groupe a été supprimé.',
          'success'
        );
      }
    });
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Liste des Groupes de Panneaux', 14, 22);
      const tableColumn = ['Nom', 'Date de création'];
      const tableRows = filteredGroups.map(group => [
        group.name || 'Sans nom',
        new Date(group.created_at).toLocaleDateString()
      ]);
      (doc as any).autoTable({
        startY: 30,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 }
      });
      doc.save('liste_groupes_panneaux.pdf');
      toast.success('Export PDF réussi');
    } catch (error) {
      toast.error('Erreur lors de l\'export PDF');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6 relative">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          Gestion des Groupes de Panneaux
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            icon={<DownloadIcon className="w-4 h-4" />}
            onClick={exportToPDF}
          >
            Exporter PDF
          </Button>
          <Button
            variant="primary"
            icon={<PlusIcon className="w-4 h-4" />}
            onClick={() => openModal()}
          >
            Nouveau Groupe
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              ✕
            </button>
            <PanelGroupForm
              initialData={selectedGroup}
              onSubmit={handlePanelGroupSubmit}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Input
            type="text"
            placeholder="Rechercher des groupes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md dark:bg-neutral-700 dark:text-neutral-100"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-100 dark:bg-neutral-700">
                <th className="p-4 text-left font-medium text-neutral-700 dark:text-neutral-200">Nom</th>
                <th className="p-4 text-left font-medium text-neutral-700 dark:text-neutral-200">Date de création</th>
                <th className="p-4 text-left font-medium text-neutral-700 dark:text-neutral-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredGroups.map((group) => (
                <tr
                  key={group.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                >
                  <td className="p-4 text-neutral-900 dark:text-neutral-100">
                    {group.name || 'Sans nom'}
                  </td>
                  <td className="p-4 text-neutral-900 dark:text-neutral-100">
                    {new Date(group.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        icon={<EditIcon className="w-4 h-4" />}
                        onClick={() => openModal(group)}
                        aria-label="Modifier"
                      />
                      <Button
                        variant="ghost"
                        icon={<TrashIcon className="w-4 h-4 text-red-500" />}
                        onClick={() => handleDeleteGroup(group.id)}
                        aria-label="Supprimer"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredGroups.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-neutral-500 dark:text-neutral-400">
                    Aucun groupe trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center p-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        <span className="text-neutral-600 dark:text-neutral-300">
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>
      </div>
    </div>
  );
}