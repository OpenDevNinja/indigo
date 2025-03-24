'use client';
// Importations nécessaires
import { useState, useEffect } from 'react';
import { PlusIcon, EditIcon, TrashIcon, DownloadIcon } from 'lucide-react';
import { PanelType } from '@/types/type';
import { PanelTypeService } from '@/services/panelTypeService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PanelTypeForm, { PanelTypeFormData } from '@/components/panels/PanelTypeForm';
import { Toaster, toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function PanelTypePage() {
  const [panelTypes, setPanelTypes] = useState<PanelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPanelType, setSelectedPanelType] = useState<PanelType | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Ajout du numéro de page courante
  const [itemsPerPage] = useState(10); // Nombre d'éléments par page
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }
    fetchPanelTypes();
  }, []);

  const fetchPanelTypes = async () => {
    try {
      setLoading(true);
      const response = await PanelTypeService.getAll();
      setPanelTypes(response);
    } catch (error) {
      toast.error('Impossible de charger les types de panneaux');
    } finally {
      setLoading(false);
    }
  };

  const filteredPanelTypes = panelTypes.filter(type =>
    type.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPanelTypes = filteredPanelTypes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(filteredPanelTypes.length / itemsPerPage);

  const openModal = (panelType?: PanelType) => {
    setSelectedPanelType(panelType || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPanelType(null);
  };

  const handlePanelTypeSubmit = async (formData: PanelTypeFormData) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const panelTypeData = {
          type: formData.type.trim()
        };
        let response;
        if (selectedPanelType) {
          response = await PanelTypeService.update(selectedPanelType.id, panelTypeData as PanelType);
        } else {
          response = await PanelTypeService.create(panelTypeData as PanelType);
        }
        if (response) {
          await fetchPanelTypes();
          closeModal();
          resolve(response);
        } else {
          reject(new Error('Pas de réponse de l\'API'));
        }
      } catch (error: any) {
        reject(error);
      }
    });
    toast.promise(promise, {
      loading: 'Enregistrement en cours...',
      success: selectedPanelType ? 'Type mis à jour avec succès' : 'Type créé avec succès',
      error: (err) => `Erreur: ${err?.response?.data?.detail || err.message || 'Une erreur est survenue'}`
    });
  };

  const handleDeletePanelType = async (id: string) => {
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
            await PanelTypeService.delete(id);
            await fetchPanelTypes();
            resolve(true);
          } catch (error) {
            reject(error);
          }
        });
        toast.promise(promise, {
          loading: 'Suppression en cours...',
          success: 'Type de panneau supprimé avec succès',
          error: 'Impossible de supprimer le type de panneau'
        });
        Swal.fire(
          'Supprimé!',
          'Le type de panneau a été supprimé.',
          'success'
        );
      }
    });
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Liste des Types de Panneaux', 14, 22);
      const tableColumn = ['Type'];
      const tableRows = filteredPanelTypes.map(type => [type.type]);
      (doc as any).autoTable({
        startY: 30,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 }
      });
      doc.save('liste_types_panneaux.pdf');
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
          Gestion des Types de Panneaux
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
            Nouveau Type
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
            <PanelTypeForm
              initialData={selectedPanelType}
              onSubmit={handlePanelTypeSubmit}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Input
            type="text"
            placeholder="Rechercher des types de panneaux"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dark:text-neutral-800"
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-700">
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPanelTypes.map((type) => (
              <tr
                key={type.id}
                className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <td className="p-4 font-medium">{type.type}</td>
                <td className="p-4 flex space-x-2">
                  <Button
                    variant="ghost"
                    icon={<EditIcon className="w-4 h-4" />}
                    onClick={() => openModal(type)}
                    aria-label="Modifier"
                  />
                  <Button
                    variant="ghost"
                    icon={<TrashIcon className="w-4 h-4 text-red-500" />}
                    onClick={() => handleDeletePanelType(type.id)}
                    aria-label="Supprimer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between p-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Précédent
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}