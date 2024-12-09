'use client';

import { useState } from 'react';
import { PlusIcon, MailIcon, PhoneIcon, EditIcon, TrashIcon, DownloadIcon } from 'lucide-react';
import { clientsData } from '@/lib/mock-data';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

import { v4 as uuidv4 } from 'uuid';
import ClientForm, { ClientFormData } from '@/components/client/ClientForm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  totalCampaigns: number;
  activeContracts: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(clientsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleClientCreation = (newClient: ClientFormData) => {
    const clientToAdd: Client = {
      id: uuidv4(),
      name: newClient.companyName || '', // Provide a default empty string if undefined
      contactPerson: newClient.contactName || '',
      email: newClient.email || '',
      phone: newClient.phone || '',
      totalCampaigns: 0, // Default value, can be updated later
      activeContracts: 0 // Default value, can be updated later
    };
    setClients([...clients, clientToAdd]);
    closeModal();
  };
  const exportToPDF = () => {
    // Create a new PDF document
    const doc = new jsPDF();

    // Document title
    doc.setFontSize(18);
    doc.text('Liste des Clients', 14, 22);

    // Prepare table columns
    const tableColumn = [
      'Nom',
      'Personne de Contact',
      'Email',
      'Téléphone',
      'Campagnes Totales',
      'Contrats Actifs'
    ];

    // Prepare table rows
    const tableRows = filteredClients.map(client => [
      client.name,
      client.contactPerson,
      client.email,
      client.phone,
      client.totalCampaigns.toString(),
      client.activeContracts.toString()
    ]);

    // Add table to document
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

    // Save the document
    doc.save('liste_clients.pdf');
  };
  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          Gestion des Clients
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
            Nouveau Client
          </Button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              ✕
            </button>
            <ClientForm
              onSubmit={handleClientCreation}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Input
            type="text"
            placeholder="Rechercher des clients"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='dark:text-neutral-800'
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-700">
              <th className="p-4 text-left">Nom</th>
              <th className="p-4 text-left">Contact</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Téléphone</th>
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
                <td className="p-4 font-medium">{client.name}</td>
                <td className="p-4">{client.contactPerson}</td>
                <td className="p-4 flex   items-center">
                  <MailIcon className="w-4 h-4 mr-2 text-neutral-500" />
                  {client.email}
                  <br />
                  {client.phone}
                </td>
                {/*  <td className="p-4 flex items-center">
                  <PhoneIcon className="w-4 h-4 mr-2 text-neutral-500" />
                  {client.phone}
                </td> */}
                <td className="p-4">{client.totalCampaigns}</td>
                <td className="p-4">{client.activeContracts}</td>
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