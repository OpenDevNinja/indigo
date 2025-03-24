// PanelGroupForm.tsx
import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { PanelGroup } from '@/types/type';
import { toast } from 'react-hot-toast';

export interface PanelGroupFormData {
  name: string;
}

interface PanelGroupFormProps {
  initialData?: PanelGroup | null;
  onSubmit: (groupData: PanelGroupFormData) => void;
  onCancel: () => void;
}

const PanelGroupForm: React.FC<PanelGroupFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<PanelGroupFormData>({
    name: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || ''
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
    if (!formData.name.trim()) {
      toast.error('Veuillez remplir le nom du groupe');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
        {initialData ? 'Modifier le Groupe' : 'Nouveau Groupe'}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <Input
          type="text"
          name="name"
          label="Nom du Groupe"
          value={formData.name}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-100"
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
          {initialData ? 'Mettre à jour' : 'Créer le Groupe'}
        </Button>
      </div>
    </form>
  );
};

export default PanelGroupForm;