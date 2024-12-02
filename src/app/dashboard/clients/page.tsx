'use client';

import { useState } from 'react';
import { PlusIcon, MailIcon, PhoneIcon, EditIcon } from 'lucide-react';
import { clientsData } from '@/lib/mock-data';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

import { v4 as uuidv4 } from 'uuid';
import ClientForm from '@/components/client/ClientForm';

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

  const handleClientCreation = (newClient: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
    clientType: 'particulier' | 'entreprise' | 'institution';
  }) => {
    const clientToAdd: Client = {
      id: uuidv4(),
      name: newClient.companyName,
      contactPerson: newClient.contactName,
      email: newClient.email,
      phone: newClient.phone,
      totalCampaigns: 0, // Default value, can be updated later
      activeContracts: 0 // Default value, can be updated later
    };
    setClients([...clients, clientToAdd]);
    closeModal();
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          Gestion des Clients
        </h1>
        <Button 
          variant="primary" 
          icon={<PlusIcon />}
          onClick={openModal}
        >
          Nouveau Client
        </Button>
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
              <th className="p-4 text-left">Contrats Actifs</th>
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
                <td className="p-4 flex items-center">
                  <MailIcon className="w-4 h-4 mr-2 text-neutral-500" />
                  {client.email}
                </td>
                <td className="p-4 flex items-center">
                  <PhoneIcon className="w-4 h-4 mr-2 text-neutral-500" />
                  {client.phone}
                </td>
                <td className="p-4">{client.totalCampaigns}</td>
                <td className="p-4">{client.activeContracts}</td>
                <td className="p-4 flex space-x-2">
                  <Button
                    variant="ghost"
                    icon={<EditIcon className="w-4 h-4" />}
                    aria-label="Modifier"
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