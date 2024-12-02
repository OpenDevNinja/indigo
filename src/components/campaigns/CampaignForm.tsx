import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export interface CampaignFormData {
  clientName: string;
  campaignName: string;
  startDate: string;
  endDate: string;
  panelGroups: string[];
  status: 'planifiée' | 'en-cours' | 'terminée';
}

interface CampaignFormProps {
  onSubmit: (campaign: CampaignFormData) => void;
  onCancel: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    clientName: '',
    campaignName: '',
    startDate: '',
    endDate: '',
    panelGroups: [],
    status: 'planifiée'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Nouvelle Campagne</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          type="text"
          name="clientName"
          label="Nom du Client"
          value={formData.clientName}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-800"
          required
        />

        <Input 
          type="text"
          name="campaignName"
          label="Nom de la Campagne"
          value={formData.campaignName}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-800"
          required
        />

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Date de Début</label>
          <Input 
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="dark:bg-neutral-800 dark:text-neutral-800"
            required
          />
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Date de Fin</label>
          <Input 
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="dark:bg-neutral-800 dark:text-neutral-800"
            required
          />
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Statut de la Campagne</label>
          <select 
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="planifiée">Planifiée</option>
            <option value="en-cours">En Cours</option>
            <option value="terminée">Terminée</option>
          </select>
        </div>
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
          Créer la Campagne
        </Button>
      </div>
    </form>
  );
};

export default CampaignForm;