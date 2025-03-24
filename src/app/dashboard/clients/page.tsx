'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, MailIcon, EditIcon, TrashIcon, DownloadIcon } from 'lucide-react';
import { Customer, PaginatedResponse } from '@/types/type';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ClientForm from '@/components/client/ClientForm';
import { Toaster, toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import { useRouter } from 'next/navigation';
import { CustomerService } from '@/services/customerService';
import Swal from 'sweetalert2';

export default function ClientsPage() {
  const [clients, setClients] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [previousPageUrl, setPreviousPageUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }
    fetchClients();
  }, []);

  const fetchClients = async (url?: string) => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Customer> = url 
        ? await CustomerService.getByUrl(url)
        : await CustomerService.getAll();
      
      setClients(response.results);
      setNextPageUrl(response.next);
      setPreviousPageUrl(response.previous);
    } catch (error) {
      toast.error('Impossible de charger les clients');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (url: string | null) => {
    if (url) {
      setCurrentPage(prev => url === nextPageUrl ? prev + 1 : prev - 1);
      fetchClients(url);
    }
  };

  const filteredClients = clients.filter(client =>
    client.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.entreprise_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.city.commune.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientSubmit = async (formData: CustomerFormData) => {
    try {
      if (selectedClient) {
        await CustomerService.update(selectedClient.id, formData);
        toast.success('Client mis à jour avec succès');
      } else {
        await CustomerService.create(formData);
        toast.success('Client créé avec succès');
      }
      await fetchClients();
      setIsModalOpen(false);
      setSelectedClient(null);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Une erreur est survenue');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Liste des Clients', 20, 10);

    const tableColumn = ['Nom', 'Entreprise', 'Email', 'Téléphone', 'Ville', 'Commune', 'Pays'];
    const tableRows = filteredClients.map(client => [
      client.fullname,
      client.entreprise_name || '-',
      client.email,
      `${client.indication} ${client.phone}`,
      client.city.name,
      client.city.commune.name,
      client.city.commune.country.name
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save('clients.pdf');
    toast.success('Export PDF réussi');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Toaster />
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          Gestion des Clients
        </h1>
        <div className="flex space-x-2">
          <Button variant="secondary" icon={<DownloadIcon />} onClick={exportToPDF}>
            Exporter PDF
          </Button>
          <Button variant="primary" icon={<PlusIcon />} onClick={() => setIsModalOpen(true)}>
            Nouveau Client
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Input
            type="text"
            placeholder="Rechercher des clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-700">
                <th className="p-4 text-left">Nom</th>
                <th className="p-4 text-left">Entreprise</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Ville</th>
                <th className="p-4 text-left">Commune</th>
                <th className="p-4 text-left">Pays</th>
                <th className="p-4 text-left">Campagnes</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr 
                  key={client.id}
                  className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  <td className="p-4 font-medium">{client.fullname}</td>
                  <td className="p-4">{client.entreprise_name || '-'}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <MailIcon className="w-4 h-4 mr-2 text-neutral-500" />
                      {client.email}
                    </div>
                    <div className="mt-1">
                      {client.indication} {client.phone}
                    </div>
                  </td>
                  <td className="p-4">{client.city.name}</td>
                  <td className="p-4">{client.city.commune.name}</td>
                  <td className="p-4">{client.city.commune.country.name}</td>
                  <td className="p-4">{client.count_campaign}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        icon={<EditIcon className="w-4 h-4" />}
                        onClick={() => {
                          setSelectedClient(client);
                          setIsModalOpen(true);
                        }}
                      />
                      <Button
                        variant="ghost"
                        icon={<TrashIcon className="w-4 h-4 text-red-500" />}
                        onClick={() => {
                          Swal.fire({
                            title: 'Confirmer la suppression?',
                            text: "Cette action est irréversible",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Oui, supprimer',
                            cancelButtonText: 'Annuler'
                          }).then(async (result) => {
                            if (result.isConfirmed) {
                              try {
                                await CustomerService.delete(client.id);
                                await fetchClients();
                                toast.success('Client supprimé');
                              } catch (error) {
                                toast.error('Erreur lors de la suppression');
                              }
                            }
                          });
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between p-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button
            variant="secondary"
            disabled={!previousPageUrl}
            onClick={() => handlePageChange(previousPageUrl)}
          >
            Précédent
          </Button>
          <span className="text-neutral-600 dark:text-neutral-400">
            Page {currentPage}
          </span>
          <Button
            variant="secondary"
            disabled={!nextPageUrl}
            onClick={() => handlePageChange(nextPageUrl)}
          >
            Suivant
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ClientForm
                initialData={selectedClient}
                onSubmit={handleClientSubmit}
                onCancel={() => {
                  setIsModalOpen(false);
                  setSelectedClient(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}