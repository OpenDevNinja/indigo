import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Customer, Panel, Campaign, PaginatedResponse } from '@/types/type';
import { CustomerService } from '@/services/customerService';
import { PanelService } from '@/services/panelService';
import { toast } from 'react-hot-toast';

interface PanelSelection {
  panel: Panel;
  quantity: number;
}

interface CampaignFormProps {
  initialData?: Campaign;
  onSubmit: (campaignData: any) => void;
  onCancel: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [panels, setPanels] = useState<Panel[]>([]);
  const [selectedPanels, setSelectedPanels] = useState<PanelSelection[]>([]);
  const [isPanelDialogOpen, setIsPanelDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    customer_id: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersResponse, panelsResponse] = await Promise.all([
          CustomerService.getAll(),
          PanelService.getAll()
        ]);

        setCustomers(customersResponse.results);
        setPanels(panelsResponse.results);

        if (initialData) {
          setFormData({
            customer_id: initialData.customer.id,
            start_date: initialData.start_date,
            end_date: initialData.end_date,
          });
          setSelectedPanels(initialData.panel.map(p => ({
            panel: p.panel,
            quantity: p.quantity
          })));
        }
      } catch (error) {
        toast.error('Erreur lors du chargement des données');
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePanelSelect = (panel: Panel) => {
    setSelectedPanels(prev => {
      const existing = prev.find(p => p.panel.id === panel.id);
      if (existing) {
        return prev.filter(p => p.panel.id !== panel.id);
      }
      return [...prev, { panel, quantity: 1 }];
    });
  };

  const handleQuantityChange = (panelId: string, quantity: number) => {
    setSelectedPanels(prev => prev.map(p => 
      p.panel.id === panelId ? { ...p, quantity } : p
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPanels.length === 0) {
      toast.error('Veuillez sélectionner au moins un panneau');
      return;
    }

    if (!formData.customer_id) {
      toast.error('Veuillez sélectionner un client');
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      toast.error('Veuillez remplir les dates de début et de fin');
      return;
    }

    // Correction ici: utiliser customer_id au lieu de customer
    const campaignData = {
      customer_id: formData.customer_id,  // Changé de 'customer' à 'customer_id'
      start_date: formData.start_date,
      end_date: formData.end_date,
      panel: selectedPanels.map(p => ({
        panel: p.panel.id,
        quantity: p.quantity
      }))
    };

    try {
      await onSubmit(campaignData);
      toast.success(initialData ? 'Campagne mise à jour avec succès' : 'Campagne créée avec succès');
    } catch (error) {
      toast.error(initialData ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création');
      console.error('Erreur lors de la soumission:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  const filteredPanels = panels.filter(panel => 
    panel.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    panel.surface?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
        {initialData ? 'Modifier la Campagne' : 'Nouvelle Campagne'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Client</label>
          <select
            name="customer_id"
            value={formData.customer_id}
            onChange={handleChange}
            className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            required
          >
            <option value="">Sélectionner un client</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.fullname}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Date de début</label>
          <Input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="dark:bg-neutral-800 dark:text-neutral-100"
            required
          />
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Date de fin</label>
          <Input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="dark:bg-neutral-800 dark:text-neutral-100"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Panneaux sélectionnés</label>
        <Button 
          type="button"
          variant="secondary"
          onClick={() => setIsPanelDialogOpen(true)}
          className="mb-4"
        >
          Sélectionner les panneaux
        </Button>

        {selectedPanels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedPanels.map(({ panel, quantity }) => (
              <div key={panel.id} className="border rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">{panel.code}</span>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(panel.id, parseInt(e.target.value))}
                    className="w-24"
                  />
                </div>
                <div className="text-sm">
                  <p>Surface: {panel.surface}</p>
                  <p>Sens: {panel.sense}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isPanelDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Sélection des Panneaux</h3>
            <Input
              type="text"
              placeholder="Rechercher un panneau"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
              {filteredPanels.map(panel => (
                <div 
                  key={panel.id}
                  onClick={() => handlePanelSelect(panel)}
                  className={`
                    border rounded p-4 cursor-pointer
                    ${selectedPanels.some(p => p.panel.id === panel.id)
                      ? 'bg-primary-light dark:bg-primary-dark border-primary'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }
                  `}
                >
                  <div className="font-bold">{panel.code}</div>
                  <div className="text-sm">
                    <p>Surface: {panel.surface}</p>
                    <p>Sens: {panel.sense}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="secondary"
                onClick={() => setIsPanelDialogOpen(false)}
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          {initialData ? 'Mettre à jour' : 'Créer la campagne'}
        </Button>
      </div>
    </form>
  );
};

export default CampaignForm;