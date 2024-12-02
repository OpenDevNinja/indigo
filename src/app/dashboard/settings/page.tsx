'use client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import React, { useState } from 'react';

interface SettingsFormData {
  emailAlertRecipients: string[];
  alertThresholds: {
    oneMonth: number;
    twoWeeks: number;
  };
  language: 'fr' | 'en';
}

const PageSettings: React.FC = () => {
  const [formData, setFormData] = useState<SettingsFormData>({
    emailAlertRecipients: [],
    alertThresholds: {
      oneMonth: 30,
      twoWeeks: 14
    },
    language: 'fr'
  });

  const [newRecipient, setNewRecipient] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addEmailRecipient = () => {
    if (newRecipient && !formData.emailAlertRecipients.includes(newRecipient)) {
      setFormData(prev => ({
        ...prev,
        emailAlertRecipients: [...prev.emailAlertRecipients, newRecipient]
      }));
      setNewRecipient('');
    }
  };

  const removeEmailRecipient = (email: string) => {
    setFormData(prev => ({
      ...prev,
      emailAlertRecipients: prev.emailAlertRecipients.filter(r => r !== email)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings save logic
    console.log('Settings Submitted:', formData);
  };

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Paramètres de l'Application</h1>
        {/* <ThemeToggle /> */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Alerts Configuration */}
        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Configuration des Alertes par Email</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Ajouter un Destinataire</label>
              <div className="flex space-x-2">
                <Input 
                  type="email"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="email@example.com"
                  className="dark:bg-neutral-700 dark:text-neutral-100"
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={addEmailRecipient}
                  className="dark:bg-primary-dark dark:text-neutral-100"
                >
                  Ajouter
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Destinataires Actuels</label>
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md p-2 max-h-40 overflow-y-auto">
                {formData.emailAlertRecipients.length === 0 ? (
                  <p className="text-neutral-500 dark:text-neutral-400">Aucun destinataire</p>
                ) : (
                  formData.emailAlertRecipients.map(email => (
                    <div key={email} className="flex justify-between items-center bg-neutral-100 dark:bg-neutral-800 p-2 rounded mb-1">
                      <span className="text-neutral-700 dark:text-neutral-300">{email}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeEmailRecipient(email)}
                        className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Seuils d'Alerte</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Alerte 1 Mois Avant</label>
              <Input 
                type="number"
                name="oneMonth"
                value={formData.alertThresholds.oneMonth}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  alertThresholds: {
                    ...prev.alertThresholds,
                    oneMonth: Number(e.target.value)
                  }
                }))}
                className="dark:bg-neutral-700 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Alerte 2 Semaines Avant</label>
              <Input 
                type="number"
                name="twoWeeks"
                value={formData.alertThresholds.twoWeeks}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  alertThresholds: {
                    ...prev.alertThresholds,
                    twoWeeks: Number(e.target.value)
                  }
                }))}
                className="dark:bg-neutral-700 dark:text-neutral-100"
              />
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Langue</h2>
          
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 mb-2">Langue de l'Interface</label>
            <select 
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full rounded-md border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="secondary" 
            className="dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            className="dark:bg-primary-dark dark:hover:bg-primary-dark/80"
          >
            Enregistrer les Paramètres
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PageSettings;