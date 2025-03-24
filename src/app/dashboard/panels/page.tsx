"use client"
import { useState, useEffect } from 'react';
import { PlusIcon, EditIcon, TrashIcon, DownloadIcon } from 'lucide-react';
import { Panel, PaginatedResponse, PanelApiPayload } from '@/types/type';
import { PanelService } from '@/services/panelService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PanelForm from '@/components/panels/PanelForm';
import { Toaster, toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function PanelsPage() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }
    fetchPanels();
  }, []);

  const fetchPanels = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Panel> = await PanelService.getAll();
      setPanels(response.results);
    } catch (error) {
      toast.error('Impossible de charger les panneaux');
    } finally {
      setLoading(false);
    }
  };

  const filteredPanels = panels.filter(panel =>
    panel.type_pannel.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    panel.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    panel.city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPanels = filteredPanels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(filteredPanels.length / itemsPerPage);

  const openModal = (panel?: Panel) => {
    setSelectedPanel(panel || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPanel(null);
  };

  const handlePanelSubmit = async (formData: PanelApiPayload) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        // Vérification des données avant soumission
        if (!formData.type_pannel_id || !formData.group_pannel_id || !formData.city_id) {
          throw new Error('Données de formulaire incomplètes');
        }

        console.log('Submitting data:', formData); // Pour le débogage

        let response;
        if (selectedPanel?.id) {
          response = await PanelService.patch(selectedPanel.id, {
            type_pannel_id: formData.type_pannel_id,
            group_pannel_id: formData.group_pannel_id,
            surface: formData.surface,
            city_id: formData.city_id,
            commune_id: formData.commune_id,
            country_id: formData.country_id,
            quantity: formData.quantity,
            face_number: formData.face_number,
            sense: formData.sense,
            description: formData.description
          });
         
         
        } else {
          response = await PanelService.create(formData);
        }

        if (response) {
          await fetchPanels();
          closeModal();
          resolve(response);
        } else {
          reject(new Error('Pas de réponse de l\'API'));
        }
      } catch (error: any) {
        console.error('Erreur API:', error);
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Enregistrement...',
      success: selectedPanel ? 'Panneau mis à jour avec succès' : 'Panneau créé avec succès',
      error: (err) => `Erreur: ${err?.message || 'Une erreur est survenue'}`
    });
  };

  const handleDeletePanel = async (id: string) => {
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
            await PanelService.delete(id);
            await fetchPanels();
            resolve(true);
          } catch (error) {
            reject(error);
          }
        });
        toast.promise(promise, {
          loading: 'Suppression en cours...',
          success: 'Panneau supprimé avec succès',
          error: 'Impossible de supprimer le panneau'
        });
        Swal.fire(
          'Supprimé!',
          'Le panneau a été supprimé.',
          'success'
        );
      }
    });
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Liste des Panneaux', 14, 22);
      const tableColumn = [
        'Type',
        'Groupe',
        'Surface',
        'Ville',
        'Commune',
        'Pays',
        'Faces',
        'Sens'
      ];
      const tableRows = filteredPanels.map(panel => [
        panel.type_pannel.type || '-',
        panel.group_pannel.name || '-',
        panel.surface,
        panel.city.name,
        panel.city.commune.name || '-',
        panel.city.commune.country.name || '-', 
        panel.face_number.toString(),
        panel.sense || '-'
      ]);
      (doc as any).autoTable({
        startY: 30,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 }
      });
      doc.save('liste_panneaux.pdf');
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
          Gestion des Panneaux
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
            Nouveau Panneau
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
            <PanelForm
              initialData={selectedPanel}
              onSubmit={handlePanelSubmit}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Input
            type="text"
            placeholder="Rechercher des panneaux"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dark:text-neutral-800"
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-700">
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Groupe</th>
              <th className="p-4 text-left">Surface</th>
              <th className="p-4 text-left">Ville</th>
              <th className="p-4 text-left">Commune</th>
              <th className="p-4 text-left">Pays</th>
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Quantité</th>
              <th className="p-4 text-left">Faces</th>
              <th className="p-4 text-left">Sens</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPanels.map((panel) => (
              <tr
                key={panel.id}
                className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <td className="p-4">{panel.type_pannel.type || '-'}</td>
                <td className="p-4">{panel.group_pannel.name || '-'}</td>
                <td className="p-4">{panel.surface}</td>
                <td className="p-4">{panel.city.name}</td>
                <td className="p-4">{panel.city.commune.name || '-'}</td>
                <td className="p-4">{panel.city.commune.country.name || '-'}</td>
                <td className="p-4">{panel.code || '-'}</td>
                <td className="p-4">{panel.quantity}</td>
                <td className="p-4">{panel.face_number}</td>
                <td className="p-4">{panel.sense || '-'}</td>
                <td className="p-4 flex space-x-2">
                  <Button
                    variant="ghost"
                    icon={<EditIcon className="w-4 h-4" />}
                    onClick={() => openModal(panel)}
                    aria-label="Modifier"
                  />
                  <Button
                    variant="ghost"
                    icon={<TrashIcon className="w-4 h-4 text-red-500" />}
                    onClick={() => handleDeletePanel(panel.id)}
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