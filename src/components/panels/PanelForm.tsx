import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { v4 as uuidv4 } from 'uuid';

export interface PanelFormData {
  id?: string;
  type: 'dynamique' | 'statique';
  panelType: '12m2' | 'BigSize' | 'PetitsPanneaux' | 'BornesKilometriques';
  pays: string;
  commune: string;
  geolocation: string;
  direction: string;
  sens: string;
  format: string;
  surface: number;
  faces: number;
  gpsCoordinates: string;
  status?: 'Disponible' | 'Indisponible';
}

interface PanelFormProps {
  onSubmit: (panel: PanelFormData) => void;
  onCancel: () => void;
}

const PanelForm: React.FC<PanelFormProps> = ({ onSubmit, onCancel }) => {
  // Liste des pays prédéfinis
  const paysList = [
    'France', 
    'Belgique', 
    'Suisse', 
    'Canada', 
    'Maroc', 
    'Algérie', 
    'Tunisie'
  ];

  // Liste des communes (à remplacer par une vraie liste ou une API)
  const communesList = {
    'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'],
    'Belgique': ['Bruxelles', 'Anvers', 'Gand', 'Charleroi'],
    'Suisse': ['Genève', 'Zurich', 'Berne', 'Lausanne'],
    'Canada': ['Montréal', 'Toronto', 'Vancouver', 'Ottawa'],
    'Maroc': ['Casablanca', 'Rabat', 'Marrakech', 'Fès'],
    'Algérie': ['Alger', 'Oran', 'Constantine', 'Annaba'],
    'Tunisie': ['Tunis', 'Sfax', 'Sousse', 'Kairouan']
  };

  const [formData, setFormData] = useState<PanelFormData>({
    type: 'statique',
    panelType: '12m2',
    pays: '',
    commune: '',
    geolocation: '',
    direction: '',
    sens: '',
    format: '',
    surface: 0,
    faces: 1,
    gpsCoordinates: '',
    status: 'Disponible'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Gestion spécifique pour le pays pour réinitialiser la commune
    if (name === 'pays') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        commune: '' // Réinitialiser la commune quand le pays change
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: ['surface', 'faces'].includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const panelToSubmit = {
      ...formData,
      id: uuidv4(), // Generate a unique ID
      surface: Number(formData.surface),
      faces: Number(formData.faces)
    };
    onSubmit(panelToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Créer un Nouveau Panneau</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Groupe de panneaux</label>
          <select 
            name="panelType"
            value={formData.panelType}
            onChange={handleChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="12m2">12m²</option>
            <option value="BigSize">Big Size</option>
            <option value="PetitsPanneaux">Petits Panneaux</option>
            <option value="BornesKilometriques">Bornes Kilométriques</option>
          </select>
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Type de Média</label>
          <select 
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="statique">Statique</option>
            <option value="dynamique">Dynamique</option>
          </select>
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Pays</label>
          <select 
            name="pays"
            value={formData.pays}
            onChange={handleChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="">Sélectionnez un pays</option>
            {paysList.map(pays => (
              <option key={pays} value={pays}>{pays}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Commune</label>
          <select 
            name="commune"
            value={formData.commune}
            onChange={handleChange}
            disabled={!formData.pays}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 disabled:opacity-50"
          >
            <option value="">Sélectionnez une commune</option>
            {formData.pays && communesList[formData.pays as keyof typeof communesList]?.map(commune => (
              <option key={commune} value={commune}>{commune}</option>
            ))}
          </select>
        </div>

        <Input 
          type="text"
          name="geolocation"
          label="Situation Géographique"
          value={formData.geolocation}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-100"
        />

       {/*  <Input 
          type="text"
          name="direction"
          label="Direction"
          value={formData.direction}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-100"
        /> */}

        <Input 
          type="text"
          name="sens"
          label="Sens"
          value={formData.sens}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-100"
        />

       {/*  <Input 
          type="text"
          name="gpsCoordinates"
          label="Coordonnées GPS"
          value={formData.gpsCoordinates}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-100"
        />
 */}
        <Input 
          type="number"
          name="surface"
          label="Surface (m²)"
          value={formData.surface}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-100"
        />

        <Input 
          type="number"
          name="faces"
          label="Nombre de Faces"
          value={formData.faces}
          onChange={handleChange}
          min={1}
          max={10}
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
          Créer le Panneau
        </Button>
      </div>
    </form>
  );
};

export default PanelForm;