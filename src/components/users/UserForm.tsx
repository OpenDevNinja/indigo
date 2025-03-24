import React, { useState } from 'react';
import { RegisterUserData } from '@/services/AuthService';
import { UserData } from '@/types/user';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface UserFormProps {
  onSubmit: (userData: RegisterUserData) => void;
  onCancel: () => void;
  initialData?: UserData;
  isLoading?: boolean;
}

export default function UserForm({ onSubmit, onCancel, initialData, isLoading = false }: UserFormProps) {
  const [formData, setFormData] = useState<RegisterUserData>({
    email: initialData?.email || '',
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    phone_indi: initialData?.phone_indi || '+229',
    phone: initialData?.phone || '',
    role: initialData?.role || 'report'
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
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
        {initialData ? 'Modifier' : 'Ajouter'} un Utilisateur
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          type="text"
          name="first_name"
          label="Prénom"
          value={formData.first_name}
          onChange={handleChange}
          required 
          className="dark:bg-neutral-800 dark:text-white"
          disabled={isLoading}
        />
        <Input
          type="text"
          name="last_name"
          label="Nom"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="dark:bg-neutral-800 dark:text-white"
          disabled={isLoading}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="dark:bg-neutral-800 dark:text-white"
          disabled={isLoading}
        />
        <div className="flex gap-2">
          <Input
            type="text"
            name="phone_indi"
            label="Indicatif"
            value={formData.phone_indi}
            onChange={handleChange}
            className="w-1/3 dark:bg-neutral-800 dark:text-white"
            disabled={isLoading}
          />
          <Input
            type="tel"
            name="phone"
            label="Téléphone"
            value={formData.phone}
            onChange={handleChange}
            className="w-2/3 dark:bg-neutral-800 dark:text-white"
            disabled={isLoading}
          />
        </div>
      </div>

      <Input
        type="select"
        name="role"
        label="Rôle"
        value={formData.role}
        onChange={handleChange}
        options={[
          { value: 'report', label: 'Accès Reporting' },
          { value: 'create', label: 'Accès création campagne' },
          { value: 'admin', label: 'Administrateur' }
        ]}
        required
        className="dark:bg-neutral-800 dark:text-white"
        disabled={isLoading}
      />

      <div className="flex justify-end space-x-4 mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Chargement...' : (initialData ? 'Modifier' : 'Ajouter')}
        </Button>
      </div>
    </form>
  );
}