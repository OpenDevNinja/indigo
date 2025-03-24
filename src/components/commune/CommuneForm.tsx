// CommuneForm.tsx
import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Commune, Country } from '@/types/type';
import { CountryService } from '@/services/countryService';

export interface CommuneFormData {
  name: string;
  country_id: string;
}

interface CommuneFormProps {
  initialData?: Commune | null;
  onSubmit: (communeData: CommuneFormData) => void;
  onCancel: () => void;
}

const CommuneForm: React.FC<CommuneFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CommuneFormData>({
    name: '',
    country_id: ''
  });
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCountries();
    if (initialData) {
      setFormData({
        name: initialData.name,
        country_id: initialData.country.id
      });
    }
  }, [initialData]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await CountryService.getAll();
      setCountries(response);
    } catch (error) {
      console.error('Erreur lors du chargement des pays:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
        {initialData ? 'Modifier la Commune' : 'Nouvelle Commune'}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <Input
          type="text"
          name="name"
          label="Nom de la Commune"
          value={formData.name}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-800"
          required
        />

        <div className="flex flex-col">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Pays
          </label>
          <select
            name="country_id"
            value={formData.country_id}
            onChange={handleChange}
            className="w-full px-3 py-2 dark:bg-neutral-800  border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionnez un pays</option>
            {countries.map((country) => (
              <option key={country.id} 
              className='text-neutral-800 dark:text-neutral-200'
              value={country.id}>
                {country.name}
              </option>
            ))}
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
          {initialData ? 'Mettre à jour' : 'Créer la Commune'}
        </Button>
      </div>
    </form>
  );
};

export default CommuneForm;