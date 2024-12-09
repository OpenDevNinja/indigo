import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';


import { panelsData, clientsData, Campaign} from '@/lib/mock-data';
export interface PanelData {
  id: string;
  type: string;
  panelType: string;
  pays: string;
  commune: string;
  location: string;
  status: string;
  gpsCoordinates: string;
  surface: number;
  faces: number;
  lastCampaign: string;
  sens: string;
}

export interface CampaignFormData {
  clientName: string;
  campaignName: string;
  startDate: string;
  endDate: string;
  panelGroups: PanelData[];
  status: "Normal" | "Annulé" ;
}

interface CampaignFormProps {
  onSubmit: (campaign: CampaignFormData) => void;
  onCancel: () => void;
  initialCampaign?: Campaign; 
}

const CampaignForm: React.FC<CampaignFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialCampaign 
}) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    clientName: initialCampaign?.clientName || '',
    campaignName: initialCampaign?.campaignName || '',
    startDate: initialCampaign?.startDate || '',
    endDate: initialCampaign?.endDate || '',
    panelGroups: initialCampaign?.panelGroups || [], 
    status: initialCampaign?.status || 'Normal'
  });


  const [isPanelDialogOpen, setIsPanelDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPanels, setSelectedPanels] = useState<PanelData[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      clientName: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one panel is selected
    if (formData.panelGroups.length === 0) {
      alert('Veuillez sélectionner au moins un panneau');
      return;
    }

    onSubmit({
      ...formData,
      panelGroups: selectedPanels
    });
  };

  const openPanelDialog = () => {
    setIsPanelDialogOpen(true);
  };

  const closePanelDialog = () => {
    setIsPanelDialogOpen(false);
  };

  const handlePanelSelect = (panel: PanelData) => {
    
    const isAlreadySelected = selectedPanels.some(p => p.id === panel.id);
    
    if (isAlreadySelected) {
      // Deselect panel
      setSelectedPanels(prev => prev.filter(p => p.id !== panel.id));
    } else {
      // Select panel
      setSelectedPanels(prev => [...prev, panel]);
    }
  };

  const filteredPanels = panelsData.filter(panel => 
    panel.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    panel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    panel.commune.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Nouvelle Campagne</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client Selection */}
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Nom du Client</label>
            <select
              name="clientName"
              value={formData.clientName}
              onChange={handleClientChange}
              className="w-full p-2 border rounded dark:bg-neutral-800 dark:text-neutral-100"
              required
            >
              <option value="">Sélectionner un client</option>
              {clientsData.map(client => (
                <option key={client.id} value={client.name}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

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
        </div>

        {/* Panel Selection */}
        <div className="mt-4">
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Panneaux Sélectionnés</label>
          <div className="flex items-center space-x-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={openPanelDialog}
              className="dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
            >
              Sélectionner les Panneaux
            </Button>
            {selectedPanels.length > 0 && (
              <span className="text-neutral-600 dark:text-neutral-300">
                {selectedPanels.length} panneau(x) sélectionné(s)
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
  <Button
    type="button"
    variant="secondary"
    onClick={onCancel}
    className="w-full sm:w-auto dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
  >
    Annuler
  </Button>
  <Button
    type="submit"
    variant="primary"
    className="w-full sm:w-auto dark:bg-primary-dark dark:hover:bg-primary-dark/80"
  >
    Créer la Campagne
  </Button>
</div>
      </form>

      {/* Panel Selection Dialog */}
      <Dialog open={isPanelDialogOpen} onOpenChange={setIsPanelDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Sélection des Panneaux</DialogTitle>
            <DialogDescription>
              Recherchez et sélectionnez les panneaux pour votre campagne
            </DialogDescription>
          </DialogHeader>

          {/* Search Input */}
          <Input
            type="text"
            placeholder="Rechercher un panneau (ID, commune, emplacement)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 dark:bg-neutral-800 dark:text-neutral-100"
          />

          {/* Panels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
            {filteredPanels.map(panel => (
              <div 
                key={panel.id} 
                className={`
                  border rounded p-4 cursor-pointer transition-all 
                  ${selectedPanels.some(p => p.id === panel.id) 
                    ? 'bg-primary-light dark:bg-primary-dark/50 border-primary' 
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}
                `}
                onClick={() => handlePanelSelect(panel)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">{panel.id}</span>
                  <span 
                    className={`
                      px-2 py-1 rounded text-xs 
                      ${panel.status === 'Disponible' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'}
                    `}
                  >
                    {panel.status}
                  </span>
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-300">
                  <p>{panel.location}</p>
                  <p>{panel.type} - {panel.panelType}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-neutral-600 dark:text-neutral-300">
              {selectedPanels.length} panneau(x) sélectionné(s)
            </span>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
  <Button 
    type="button" 
    variant="secondary" 
    onClick={closePanelDialog}
    className="w-full sm:w-auto"
  >
    Annuler
  </Button>
  <Button 
    type="button" 
    variant="primary" 
    onClick={closePanelDialog}
    className="w-full sm:w-auto"
  >
    Confirmer
  </Button>
</div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CampaignForm;