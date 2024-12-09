'use client';
import { useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, DownloadIcon } from 'lucide-react';
import { panelsData } from '@/lib/mock-data';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PanelForm from '@/components/panels/PanelForm';
import { PanelFormData } from '@/components/panels/PanelForm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Exporter l'interface pour une utilisation dans d'autres fichiers
export interface Panel {
  id: string;
  type: string;
  panelType?: string;
  pays: string;
  commune: string;
  location: string;
  status: string;
  gpsCoordinates: string;
  surface: number;
  faces: number;
  lastCampaign: string;
  sens?: string;
}

export default function PanelsPage() {
  const [panels, setPanels] = useState<Panel[]>(panelsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPanels = panels.filter(panel =>
    panel.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    panel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    panel.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePanelCreation = (newPanel: PanelFormData) => {
    const panelToAdd: Panel = {
      id: newPanel.id || '', 
      type: newPanel.type,
      panelType: newPanel.panelType,
      pays: newPanel.pays,
      commune: newPanel.commune,
      location: newPanel.geolocation,
      status: newPanel.status || 'Disponible',
      gpsCoordinates: newPanel.gpsCoordinates,
      surface: newPanel.surface,
      faces: newPanel.faces,
      lastCampaign: 'N/A', 
      sens: newPanel.sens
    };

    setPanels([...panels, panelToAdd]);
    closeModal();
  };

  const exportToPDF = () => {
    // Créer un nouveau document PDF
    const doc = new jsPDF();
    
    // Titre du document
    doc.setFontSize(18);
    doc.text('Liste des Panneaux', 14, 22);

    // Préparer les données pour la table
    const tableColumn = [
      'ID', 
      'Type', 
      'Pays', 
      'Commune', 
      'Localisation', 
      'Statut', 
      'Surface', 
      'Faces',
      'Coordonnées GPS'
    ];
    
    const tableRows = filteredPanels.map(panel => [
      panel.id,
      panel.type,
      panel.pays,
      panel.commune,
      panel.location,
      panel.status,
      `${panel.surface} m²`,
      panel.faces.toString(),
      panel.gpsCoordinates
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
    doc.save('liste_panneaux.pdf');
  };

  return (
    <div className="space-y-6 relative">
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
            onClick={openModal}
          >
            Ajouter un Panneau
          </Button>
        </div>
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
            <PanelForm 
              onSubmit={handlePanelCreation}
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
             className='dark:text-neutral-800'
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-700">
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Pays</th>
              <th className="p-4 text-left">Commune</th>
              <th className="p-4 text-left">Localisation</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Surface</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPanels.map((panel) => (
              <tr
                key={panel.id}
                className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <td className="p-4">{panel.id}</td>
                <td className="p-4">{panel.type}</td>
                <td className="p-4">{panel.pays}</td>
                <td className="p-4">{panel.commune}</td>
                <td className="p-4">{panel.location}</td>
                <td className="p-4">
                  <span
                    className={`
                      px-2 py-1 rounded-full text-xs
                      ${panel.status === 'Disponible'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                    `}
                  >
                    {panel.status}
                  </span>
                </td>
                <td className="p-4">{panel.surface} m²</td>
                <td className="p-4 flex space-x-2">
                  <Button
                    variant="ghost"
                    icon={<EditIcon className="w-4 h-4" />}
                    aria-label="Modifier"
                  />
                  <Button
                    variant="ghost"
                    icon={<TrashIcon className="w-4 h-4 text-red-500" />}
                    aria-label="Supprimer"
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