import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { v4 as uuidv4 } from 'uuid';

export interface PanelFormData {
  id?: string;
  type: 'dynamique' | 'statique';
  panelType: '12m2' | 'BigSize' | 'PetitsPanneaux' | 'BornesKilometriques';
  geolocation: string;
  direction: string;
  format: string;
  surface: number;
  faces: 'simple' | 'double' | 'triple';
  commune: string;
  gpsCoordinates: string;
  status?: 'Disponible' | 'Indisponible';
}

interface PanelFormProps {
  onSubmit: (panel: PanelFormData) => void;
  onCancel: () => void;
}

const PanelForm: React.FC<PanelFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PanelFormData>({
    type: 'statique',
    panelType: '12m2',
    geolocation: '',
    direction: '',
    format: '',
    surface: 0,
    faces: 'simple',
    commune: '',
    gpsCoordinates: '',
    status: 'Disponible'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'surface' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const panelToSubmit = {
      ...formData,
      id: uuidv4(), // Generate a unique ID
      surface: Number(formData.surface)
    };
    onSubmit(panelToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Créer un Nouveau Panneau</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Type de Panneau</label>
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

        <Input 
          type="text"
          name="geolocation"
          label="Géolocalisation"
          value={formData.geolocation}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-800"
        />

        <Input 
          type="text"
          name="commune"
          label="Commune"
          value={formData.commune}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-800"
        />

        <Input 
          type="text"
          name="gpsCoordinates"
          label="Coordonnées GPS"
          value={formData.gpsCoordinates}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-800"
        />

        <Input 
          type="number"
          name="surface"
          label="Surface (m²)"
          value={formData.surface}
          onChange={handleChange}
          className="dark:bg-neutral-800 dark:text-neutral-800"
        />

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Nombre de Faces</label>
          <select 
            name="faces"
            value={formData.faces}
            onChange={handleChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="simple">Simple Face</option>
            <option value="double">Double Face</option>
            <option value="triple">Triple Face</option>
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
          Créer le Panneau
        </Button>
      </div>
    </form>
  );
};

export default PanelForm;