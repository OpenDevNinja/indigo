
// CommunePage.tsx
'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, EditIcon, TrashIcon, DownloadIcon } from 'lucide-react';
import { Commune, PaginatedResponse } from '@/types/type';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CommuneForm, { CommuneFormData } from '@/components/commune/CommuneForm';
import { Toaster, toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useRouter } from 'next/navigation';
import { CommuneService } from '@/services/communeService';
import Swal from 'sweetalert2';

export default function CommunePage() {
  const [communeData, setCommuneData] = useState<PaginatedResponse<Commune>>({
    count: 0,
    next: null,
    previous: null,
    results: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }
    fetchCommunes(currentPage);
  }, [currentPage]);

  const fetchCommunes = async (page: number) => {
    try {
      setLoading(true);
      const response = await CommuneService.getAll(page);
      setCommuneData(response);
    } catch (error) {
      toast.error('Impossible de charger les communes');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (commune?: Commune) => {
    setSelectedCommune(commune || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCommune(null);
  };

  const handleCommuneSubmit = async (formData: CommuneFormData) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const data = {
          name: formData.name.trim(),
          country_id: formData.country_id
        };
        let response;
        if (selectedCommune) {
          response = await CommuneService.update(selectedCommune.id, data);
        } else {
          response = await CommuneService.create(data);
        }
        if (response) {
          await fetchCommunes(currentPage);
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
      success: selectedCommune ? 'Commune mise à jour avec succès' : 'Commune créée avec succès',
      error: (err) => `Erreur: ${err?.response?.data?.detail || err.message || 'Une erreur est survenue'}`
    });
  };

  const handleDeleteCommune = async (id: string) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-la!',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const promise = new Promise(async (resolve, reject) => {
          try {
            await CommuneService.delete(id);
            await fetchCommunes(currentPage);
            resolve(true);
          } catch (error) {
            reject(error);
          }
        });
        
        toast.promise(promise, {
          loading: 'Suppression en cours...',
          success: 'Commune supprimée avec succès',
          error: 'Impossible de supprimer la commune'
        });
      }
    });
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Liste des Communes', 14, 22);
      const tableColumn = ['Nom', 'Pays'];
      const tableRows = communeData.results.map(commune => [
        commune.name,
        commune.country.name
      ]);
      (doc as any).autoTable({
        startY: 30,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 }
      });
      doc.save('liste_communes.pdf');
      toast.success('Export PDF réussi');
    } catch (error) {
      toast.error('Erreur lors de l\'export PDF');
    }
  };

  if (loading && !communeData.results.length) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6 relative">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          Gestion des Communes
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
            onClick={() => openModal()}
          >
            Nouvelle Commune
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
            <CommuneForm
              initialData={selectedCommune}
              onSubmit={handleCommuneSubmit}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Input
            type="text"
            placeholder="Rechercher des communes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dark:text-neutral-800"
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-700">
              <th className="p-4 text-left">Nom</th>
              <th className="p-4 text-left">Pays</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {communeData.results
              .filter(commune => commune.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((commune) => (
                <tr
                  key={commune.id}
                  className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  <td className="p-4 font-medium">{commune.name}</td>
                  <td className="p-4">{commune.country.name}</td>
                  <td className="p-4 flex space-x-2">
                    <Button
                      variant="ghost"
                      icon={<EditIcon className="w-4 h-4" />}
                      onClick={() => openModal(commune)}
                      aria-label="Modifier"
                    />
                    <Button
                      variant="ghost"
                      icon={<TrashIcon className="w-4 h-4 text-red-500" />}
                      onClick={() => handleDeleteCommune(commune.id)}
                      aria-label="Supprimer"
                    />
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between p-4">
          <Button
            variant="secondary"
            disabled={!communeData.previous}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Précédent
          </Button>
          <span className="py-2">
            Page {currentPage} sur {Math.ceil(communeData.count / 10)}
          </span>
          <Button
            variant="secondary"
            disabled={!communeData.next}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}