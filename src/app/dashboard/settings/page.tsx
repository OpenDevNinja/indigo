// src/app/alerts/page.tsx
"use client"
import { useState, useEffect } from 'react';
import { PlusIcon, EditIcon, TrashIcon, DownloadIcon } from 'lucide-react';
import { alertService } from '@/services/alertService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

import { Toaster, toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import AlertForm from '@/components/alerts/AlertForm';
import { Alert } from '@/types/type';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertService.getAlerts();
      setAlerts(response.results);
    } catch (error) {
      toast.error('Impossible de charger les alertes');
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(alert =>
    alert.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.indication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentAlerts = filteredAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);

  const openModal = (alert?: Alert) => {
    setSelectedAlert(alert || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  const handleAlertSubmit = async (formData: Omit<Alert, 'id' | 'created_at' | 'updated_at'>) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (selectedAlert) {
          await alertService.updateAlert(selectedAlert.id, formData);
        } else {
          await alertService.createAlert(formData);
        }
        await fetchAlerts();
        closeModal();
        resolve(true);
      } catch (error: any) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Enregistrement en cours...',
      success: selectedAlert ? 'Alerte mise à jour avec succès' : 'Alerte créée avec succès',
      error: (err) => `Erreur: ${err?.message || 'Une erreur est survenue'}`
    });
  };

  const handleDeleteAlert = async (id: string) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-la!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const promise = new Promise(async (resolve, reject) => {
          try {
            await alertService.deleteAlert(id);
            await fetchAlerts();
            resolve(true);
          } catch (error) {
            reject(error);
          }
        });

        toast.promise(promise, {
          loading: 'Suppression en cours...',
          success: 'Alerte supprimée avec succès',
          error: 'Impossible de supprimer l\'alerte'
        });
      }
    });
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Liste des Alertes', 14, 22);
      
      const tableColumn = ['Email', 'Indication', 'Téléphone', 'Date de création'];
      const tableRows = filteredAlerts.map(alert => [
        alert.email,
        alert.indication,
        alert.phone,
        new Date(alert.created_at).toLocaleDateString()
      ]);

      (doc as any).autoTable({
        startY: 30,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 }
      });

      doc.save('liste_alertes.pdf');
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
          Gestion des Alertes
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
            Nouvelle Alerte
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
            <AlertForm
              initialData={selectedAlert}
              onSubmit={handleAlertSubmit}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Input
            type="text"
            placeholder="Rechercher des alertes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dark:text-neutral-800"
          />
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-700">
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Indication</th>
              <th className="p-4 text-left">Téléphone</th>
              <th className="p-4 text-left">Date de création</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAlerts.map((alert) => (
              <tr
                key={alert.id}
                className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <td className="p-4">{alert.email}</td>
                <td className="p-4">{alert.indication}</td>
                <td className="p-4">{alert.phone}</td>
                <td className="p-4">{new Date(alert.created_at).toLocaleDateString()}</td>
                <td className="p-4 flex space-x-2">
                  <Button
                    variant="ghost"
                    icon={<EditIcon className="w-4 h-4" />}
                    onClick={() => openModal(alert)}
                    aria-label="Modifier"
                  />
                  <Button
                    variant="ghost"
                    icon={<TrashIcon className="w-4 h-4 text-red-500" />}
                    onClick={() => handleDeleteAlert(alert.id)}
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
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
          >
            Précédent
          </button>
          <span>
            Page {currentPage} sur {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}