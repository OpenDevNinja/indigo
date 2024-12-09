import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ClientFormData {
  companyName?: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  clientType: 'particulier' | 'entreprise';
}

interface ClientFormProps {
  onSubmit: (clientData: ClientFormData) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ClientFormData>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    clientType: 'entreprise'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // If changing client type to 'particulier', remove company name
      if (name === 'clientType' && value === 'particulier') {
        return {
          ...prev,
          [name]: value,
          companyName: undefined
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove companyName if it's undefined before submitting
    const submitData = { ...formData };
    if (submitData.clientType === 'particulier') {
      delete submitData.companyName;
    }
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Nouveau Client</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Type de Client</label>
          <select
            name="clientType"
            value={formData.clientType}
            onChange={handleChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="entreprise">Entreprise</option>
            <option value="particulier">Particulier</option>
            
          </select>
        </div>

        {(formData.clientType === 'entreprise' ) && (
          <Input
            type="text"
            name="companyName"
            label="Nom de l'Entreprise"
            value={formData.companyName || ''}
            onChange={handleChange}
            className="dark:bg-neutral-800 dark:text-neutral-800"
            required
          />
        )}

        <Input
          type="text"
          name="contactName"
          label="Nom du Contact"
          value={formData.contactName}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-800"
          required
        />

        <Input
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-800"
          required
        />

        <Input
          type="tel"
          name="phone"
          label="Téléphone"
          value={formData.phone}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-800"
          required
        />

        <Input
          type="text"
          name="address"
          label="Adresse"
          value={formData.address}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-800"
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="dark:bg-primary-dark dark:hover:bg-primary-dark/80"
        >
          Créer le Client
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;