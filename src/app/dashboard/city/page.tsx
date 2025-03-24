'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, EditIcon, TrashIcon, DownloadIcon } from 'lucide-react';
import { City, PaginatedResponse } from '@/types/type';
import { CityService } from '@/services/cityService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CityForm, { CityFormData } from '@/components/city/CityForm';
import { Toaster, toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function CityPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }
    fetchCities(1);
  }, []);

  const fetchCities = async (page: number) => {
    try {
      setLoading(true);
      const response: PaginatedResponse<City> = await CityService.getAll(page);
      
      // Trier les villes par ID décroissant (en supposant que les IDs plus récents sont plus grands)
      const sortedCities = [...response.results].sort((a, b) => {
        // Si on doit utiliser l'ID (qui est sous forme de string UUID)
        return b.id.localeCompare(a.id);
      });

      setCities(sortedCities);
      setTotalItems(response.count);
      setNextPage(response.next);
      setPreviousPage(response.previous);
      setCurrentPage(page);
    } catch (error) {
      toast.error('Impossible de charger les villes');
    } finally {
      setLoading(false);
    }
  };

  // Appliquer le filtre de recherche sur les villes déjà triées
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.commune.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.commune.country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (city?: City) => {
    setSelectedCity(city || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCity(null);
  };

  const handleCitySubmit = async (formData: CityFormData) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const cityData = {
          name: formData.name.trim(),
          commune_id: formData.communeId
        };
        let response;
        if (selectedCity) {
          response = await CityService.update(selectedCity.id, cityData);
        } else {
          response = await CityService.create(cityData);
        }
        if (response) {
          await fetchCities(1); // Retourner à la première page pour voir la nouvelle ville
          closeModal();
          resolve(response);
        } else {
          reject(new Error('Pas de réponse de l\'API'));
        }
      } catch (error: any) {
        console.error('Erreur détaillée:', error.response?.data || error);
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Enregistrement en cours...',
      success: selectedCity ? 'Ville mise à jour avec succès' : 'Ville créée avec succès',
      error: (err) => `Erreur: ${err?.response?.data?.detail || err.message || 'Une erreur est survenue'}`
    });
  };

  const handleDeleteCity = async (id: string) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const promise = new Promise(async (resolve, reject) => {
          try {
            await CityService.delete(id);
            await fetchCities(currentPage);
            resolve(true);
          } catch (error) {
            reject(error);
          }
        });

        toast.promise(promise, {
          loading: 'Suppression en cours...',
          success: 'Ville supprimée avec succès',
          error: 'Impossible de supprimer la ville'
        });

        Swal.fire(
          'Supprimé!',
          'La ville a été supprimée.',
          'success'
        );
      }
    });
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Liste des Villes', 14, 22);
      const tableColumn = ['Nom', 'Commune', 'Pays'];
      const tableRows = filteredCities.map(city => [
        city.name,
        city.commune.name,
        city.commune.country.name
      ]);

      (doc as any).autoTable({
        startY: 30,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 }
      });

      doc.save('liste_villes.pdf');
      toast.success('Export PDF réussi');
    } catch (error) {
      toast.error('Erreur lors de l\'export PDF');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6 relative">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          Gestion des Villes
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            icon={<DownloadIcon className="w-4 h-4" />}
            onClick={exportToPDF}
          >
            Exporter PDF
          </Button>
          <Button
            variant="primary"
            icon={<PlusIcon className="w-4 h-4" />}
            onClick={() => openModal()}
          >
            Nouvelle Ville
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              ✕
            </button>
            <CityForm
              initialData={selectedCity}
              onSubmit={handleCitySubmit}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Input
            type="text"
            placeholder="Rechercher des villes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md dark:bg-neutral-700 dark:text-neutral-100"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-100 dark:bg-neutral-700">
                <th className="p-4 text-left font-medium text-neutral-700 dark:text-neutral-200">Nom</th>
                <th className="p-4 text-left font-medium text-neutral-700 dark:text-neutral-200">Commune</th>
                <th className="p-4 text-left font-medium text-neutral-700 dark:text-neutral-200">Pays</th>
                <th className="p-4 text-left font-medium text-neutral-700 dark:text-neutral-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredCities.map((city) => (
                <tr
                  key={city.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                >
                  <td className="p-4 text-neutral-900 dark:text-neutral-100">{city.name}</td>
                  <td className="p-4 text-neutral-900 dark:text-neutral-100">{city.commune.name}</td>
                  <td className="p-4 text-neutral-900 dark:text-neutral-100">{city.commune.country.name}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        icon={<EditIcon className="w-4 h-4" />}
                        onClick={() => openModal(city)}
                        aria-label="Modifier"
                      />
                      <Button
                        variant="ghost"
                        icon={<TrashIcon className="w-4 h-4 text-red-500" />}
                        onClick={() => handleDeleteCity(city.id)}
                        aria-label="Supprimer"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCities.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-neutral-500 dark:text-neutral-400">
                    Aucune ville trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button
            variant="secondary"
            disabled={!previousPage}
            onClick={() => previousPage && fetchCities(currentPage - 1)}
            className="px-4 py-2"
          >
            Précédent
          </Button>
          <span className="text-neutral-600 dark:text-neutral-300">
            Page {currentPage} sur {Math.ceil(totalItems / 10)}
          </span>
          <Button
            variant="secondary"
            disabled={!nextPage}
            onClick={() => nextPage && fetchCities(currentPage + 1)}
            className="px-4 py-2"
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}