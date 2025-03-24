// src/components/alerts/AlertForm.tsx
import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Alert } from '@/types/type';

interface AlertFormProps {
  initialData?: Alert | null;
  onSubmit: (alertData: Omit<Alert, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const AlertForm: React.FC<AlertFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    email: '',
    indication: '',
    phone: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email,
        indication: initialData.indication,
        phone: initialData.phone
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
        {initialData ? 'Modifier l\'Alerte' : 'Nouvelle Alerte'}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <Input
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-100"
          required
        />

        <Input
          type="text"
          name="indication"
          label="Indication (Code Pays)"
          value={formData.indication}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-100"
          required
        />

        <Input
          type="tel"
          name="phone"
          label="Téléphone"
          value={formData.phone}
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
          {initialData ? 'Mettre à jour' : 'Créer l\'Alerte'}
        </Button>
      </div>
    </form>
  );
};
export default AlertForm;