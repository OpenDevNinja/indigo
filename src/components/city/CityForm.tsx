import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { City, Country, Commune } from '@/types/type';
import { CountryService } from '@/services/countryService';
import { CommuneService } from '@/services/communeService';
import toast from 'react-hot-toast';

export interface CityFormData {
  name: string;
  communeId: string;
}

interface CityFormProps {
  initialData?: City | null;
  onSubmit: (cityData: CityFormData) => void;
  onCancel: () => void;
}

const CityForm: React.FC<CityFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<CityFormData>({
    name: '',
    communeId: ''
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCountries();
    if (initialData) {
      setFormData({
        name: initialData.name,
        communeId: initialData.commune.id
      });
      setSelectedCountry(initialData.commune.country.id);
      fetchCommunes(initialData.commune.country.id);
    }
  }, [initialData]);

  const fetchCountries = async () => {
    try {
      const response = await CountryService.getAll();
      setCountries(response);
    } catch (error) {
      toast.error('Impossible de charger les pays');
    }
  };

  const fetchCommunes = async (countryId: string) => {
    setLoading(true);
    try {
      const response = await CommuneService.getAll();
      const filteredCommunes = response.results.filter(
        commune => commune.country.id === countryId
      );
      setCommunes(filteredCommunes);
    } catch (error) {
      toast.error('Impossible de charger les communes');
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    setFormData(prev => ({ ...prev, communeId: '' }));
    if (countryId) {
      await fetchCommunes(countryId);
    } else {
      setCommunes([]);
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
    if (!formData.name.trim() || !formData.communeId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
        {initialData ? 'Modifier la Ville' : 'Nouvelle Ville'}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">
            Pays
          </label>
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            required
          >
            <option value="">Sélectionnez un pays</option>
            {countries.map(country => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">
            Commune
          </label>
          <select
            name="communeId"
            value={formData.communeId}
            onChange={handleChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            required
            disabled={!selectedCountry || loading}
          >
            <option value="">Sélectionnez une commune</option>
            {communes.map(commune => (
              <option key={commune.id} value={commune.id}>
                {commune.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          type="text"
          name="name"
          label="Nom de la Ville"
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
          {initialData ? 'Mettre à jour' : 'Créer la Ville'}
        </Button>
      </div>
    </form>
  );
};

export default CityForm;