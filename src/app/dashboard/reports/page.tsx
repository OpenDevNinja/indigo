'use client';
import { useState } from 'react';
import {
  DownloadIcon,
  FileTextIcon,
  EyeIcon,
  MoreVerticalIcon
} from 'lucide-react';
import { reportsData } from '@/lib/mock-data';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

export default function ReportsPage() {
  const [reports, setReports] = useState(reportsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrage des rapports selon le terme de recherche
  const filteredReports = reports.filter(report =>
    report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (format: 'pdf' | 'excel') => {
    alert(`Exporting report as ${format}`);
  };

  const handleViewDetails = (report: any) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          Rapports
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            icon={<DownloadIcon />}
            onClick={() => handleExport('pdf')}
          >
            Exporter PDF
          </Button>
          <Button
            variant="secondary"
            icon={<DownloadIcon />}
            onClick={() => handleExport('excel')}
          >
            Exporter Excel
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Input
            type="text"
            placeholder="Rechercher des rapports"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
             className='dark:text-neutral-800'
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-700">
              <th className="p-4 text-left">Type de Rapport</th>
              <th className="p-4 text-left">Date de Génération</th>
              <th className="p-4 text-left">Période</th>
              <th className="p-4 text-left">Détails</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr
                key={report.id}
                className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <td className="p-4 flex items-center">
                  <FileTextIcon className="w-4 h-4 mr-2 text-neutral-500" />
                  {report.type}
                </td>
                <td className="p-4">
                  {new Date(report.generatedDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="p-4">{report.period}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {report.type === 'Disponibilité des Panneaux' && (
                      <>
                        <span className="text-neutral-600">
                          Panneaux Totaux: {report.totalPanels ?? 'N/A'}
                        </span>
                        <span className="text-green-600">
                          Disponibles: {report.availablePanels ?? 'N/A'}
                        </span>
                        <span className="text-red-600">
                          Occupés: {report.occupiedPanels ?? 'N/A'}
                        </span>
                      </>
                    )}
                    {report.type === 'Performance des Campagnes' && (
                      <>
                        <span className="text-neutral-600">
                          Campagnes: {report.totalCampaigns ?? 'N/A'}
                        </span>
                        <span className="text-green-600">
                          Revenus: {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'GNF'
                          }).format(report.revenueGenerated ?? 0)}
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<EyeIcon className="w-4 h-4" />}
                      onClick={() => handleViewDetails(report)}
                    >
                      Détails
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<MoreVerticalIcon className="w-4 h-4" />}
                    >
                      Plus
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Détails du Rapport: ${selectedReport.type}`}
        >
          <div className="space-y-4">
            {selectedReport.type === 'Disponibilité des Panneaux' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Panneaux Totaux</p>
                  <p>{selectedReport.totalPanels ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold">Panneaux Disponibles</p>
                  <p className="text-green-600">{selectedReport.availablePanels ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold">Panneaux Occupés</p>
                  <p className="text-red-600">{selectedReport.occupiedPanels ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold">Période</p>
                  <p>{selectedReport.period}</p>
                </div>
              </div>
            )}
            {selectedReport.type === 'Performance des Campagnes' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Nombre de Campagnes</p>
                  <p>{selectedReport.totalCampaigns ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold">Revenus Générés</p>
                  <p className="text-green-600">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'GNF'
                    }).format(selectedReport.revenueGenerated ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Période</p>
                  <p>{selectedReport.period}</p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
