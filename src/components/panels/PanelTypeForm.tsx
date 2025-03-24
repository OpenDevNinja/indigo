import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { PanelType } from '@/types/type';

export interface PanelTypeFormData {
  type: string;
}

interface PanelTypeFormProps {
  initialData?: PanelType | null;
  onSubmit: (panelTypeData: PanelTypeFormData) => void;
  onCancel: () => void;
}

const PanelTypeForm: React.FC<PanelTypeFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PanelTypeFormData>({
    type: ''
  });

  useEffect(() => {
    if (initialData && initialData.type) {
      setFormData({
        type: initialData.type
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
        {initialData ? 'Modifier le Type' : 'Nouveau Type'}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <Input
          type="text"
          name="type"
          label="Type de Panneau"
          value={formData.type}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-800"
          required
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
          {initialData ? 'Mettre à jour' : 'Créer le Type'}
        </Button>
      </div>
    </form>
  );
};

export default PanelTypeForm;