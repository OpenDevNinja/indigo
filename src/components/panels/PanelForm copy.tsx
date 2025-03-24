import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { 
  PanelType, 
  PanelGroup, 
  City, 
  Country,
  PanelApiPayload,
  PanelFormData,
  Commune,
  Panel
} from '@/types/type';
import { PanelTypeService } from '@/services/panelTypeService';
import { CityService } from '@/services/cityService';
import { CommuneService } from '@/services/communeService';
import { PanelGroupService } from '@/services/pannelGroup';
import { CountryService } from '@/services/countryService';

enum PanelOrientation {
  LANDSCAPE = 'Paysage',
  PORTRAIT = 'Portrait'
}

interface PanelFormProps {
  initialData?: Panel | null;
  onSubmit: (panelData: PanelApiPayload) => void;
  onCancel: () => void;
}

const PanelForm: React.FC<PanelFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [panelTypes, setPanelTypes] = useState<PanelType[]>([]);
  const [panelGroups, setPanelGroups] = useState<PanelGroup[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<PanelFormData>({
    type_pannel: {
      id: '',
      type: ''
    },
    group_pannel: {
      id: '',
      name: ''
    },
    surface: '',
    city: {
      id: '',
      name: '',
      commune: {
        id: '',
        name: '',
        country: {
          id: '',
          name: ''
        }
      }
    },
    country: '',
    quantity: 1,
    face_number: 1,
    sense: '',
    description: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          typesResponse,
          groupsResponse,
          communesResponse,
          citiesResponse,
          countriesResponse
        ] = await Promise.all([
          PanelTypeService.getAll(),
          PanelGroupService.getAll(),
          CommuneService.getAll(),
          CityService.getAll(),
          CountryService.getAll()
        ]);

        setPanelTypes(typesResponse);
        setPanelGroups(groupsResponse.results);
        setCommunes(communesResponse.results);
        setCities(citiesResponse.results);
        setCountries(countriesResponse);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        country: initialData.city.commune.country.id, // Ajoutez cette ligne
        type_pannel: {
          id: initialData.type_pannel.id,
          type: initialData.type_pannel.type
        },
        group_pannel: {
          id: initialData.group_pannel.id,
          name: initialData.group_pannel.name
        }
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        if (parent === 'city' && child === 'commune') {
          return {
            ...prev,
            city: {
              ...prev.city,
              id: '',
              name: '',
              commune: {
                id: value,
                name: communes.find(c => c.id === value)?.name || '',
                country: prev.city.commune.country
              }
            }
          };
        }
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof PanelFormData],
            [child]: value
          }
        };
      }
      
      return {
        ...prev,
        [name]: ['quantity', 'face_number'].includes(name) ? Number(value) : value
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const apiPayload: PanelApiPayload = {
      type_pannel_id: formData.type_pannel.id,
      group_pannel_id: formData.group_pannel.id,
      surface: formData.surface,
      city_id: formData.city.id,
      commune_id: formData.city.commune.id, // Change this to use commune ID from form data
      country_id: formData.city.commune.country.id, // Use the country ID from the nested structure
      quantity: formData.quantity,
      face_number: formData.face_number,
      sense: formData.sense,
      description: formData.description
    };
  
    onSubmit(apiPayload);
  };
  const filteredCities = cities.filter(
    city => city.commune.id === formData.city.commune.id
  );

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
        {initialData ? 'Modifier le Panneau' : 'Nouveau Panneau'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Type de Panneau</label>
          <select
            name="type_pannel.id"
            value={formData.type_pannel.id}
            onChange={handleChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            required
          >
            <option value="">Sélectionnez un type</option>
            {panelTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Groupe de Panneaux</label>
          <select
            name="group_pannel.id"
            value={formData.group_pannel.id}
            onChange={handleChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            required
          >
            <option value="">Sélectionnez un groupe</option>
            {panelGroups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Commune</label>
          <select
            name="city.commune.id"
            value={formData.city.commune.id}
            onChange={handleChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            required
          >
            <option value="">Sélectionnez une commune</option>
            {communes.map(commune => (
              <option key={commune.id} value={commune.id}>
                {commune.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Ville</label>
          <select
            name="city.id"
            value={formData.city.id}
            onChange={handleChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            required
            disabled={!formData.city.commune.id}
          >
            <option value="">Sélectionnez une ville</option>
            {filteredCities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Pays</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
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

        <Input
          type="text"
          name="surface"
          label="Surface"
          value={formData.surface}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-100"
          required
        />

        <Input
          type="number"
          name="quantity"
          label="Quantité"
          value={formData.quantity}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-100"
          min={1}
          required
        />

        <Input
          type="number"
          name="face_number"
          label="Nombre de Faces"
          value={formData.face_number}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-100"
          min={1}
          required
        />

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Sens</label>
          <select
            name="sense"
            value={formData.sense}
            onChange={handleChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            required
          >
            <option value="">Sélectionnez une orientation</option>
            {Object.values(PanelOrientation).map((orientation) => (
              <option key={orientation} value={orientation}>
                {orientation}
              </option>
            ))}
          </select>
        </div>

        <Input
          type="text"
          name="description"
          label="Description"
          value={formData.description || ''}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-100"
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
          {initialData ? 'Mettre à jour' : 'Créer le Panneau'}
        </Button>
      </div>
    </form>
  );
};

export default PanelForm;