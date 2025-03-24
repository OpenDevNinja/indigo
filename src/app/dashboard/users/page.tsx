'use client';
import { useState, useEffect } from 'react';
import { PlusIcon, EditIcon, TrashIcon, DownloadIcon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { RegisterUserData, AuthService } from '@/services/AuthService';
import { UserService } from '@/services/UserService';
import { UserData } from '@/types/user';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import UserForm from '@/components/users/UserForm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await UserService.listUsers();
      setUsers(response.results || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.last_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer l'ouverture du modal d'ajout/édition
  const handleOpenModal = (mode: 'add' | 'edit', user?: UserData) => {
    setModalMode(mode);
    setSelectedUser(user || null);
    setIsModalOpen(true);
  };

  // Fermer le modal d'ajout/édition
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Gérer l'ouverture du modal de suppression
  const handleOpenDeleteModal = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
    setAdminPassword('');
  };

  // Fermer le modal de suppression
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
    setAdminPassword('');
  };

  // Soumettre le formulaire d'ajout/édition
  const handleSubmit = async (userData: RegisterUserData) => {
    try {
      setIsLoading(true);
      if (modalMode === 'add') {
        await UserService.createUser(userData);
        toast.success('Utilisateur ajouté avec succès');
      } else if (selectedUser) {
        await UserService.updateUser({ 
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          phone_indi: userData.phone_indi,
          role: userData.role
        });
        toast.success('Utilisateur modifié avec succès');
      }
      fetchUsers();
      handleCloseModal();
    } catch (error: any) {
      const errorMessage = error.detail || `Erreur lors de ${modalMode === 'add' ? 'l\'ajout' : 'la modification'} de l'utilisateur`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Soumettre la suppression d'un utilisateur
  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    try {
      setIsLoading(true);
      await UserService.deleteUser({ 
        user_id: selectedUser.id || '', 
        password: adminPassword
      });
      toast.success('Utilisateur supprimé avec succès');
      fetchUsers();
      handleCloseDeleteModal();
    } catch (error: any) {
      const errorMessage = error.detail || "Vous n'êtes pas autorisé à supprimer cet utilisateur";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Liste des Utilisateurs', 14, 22);

    const tableColumn = ['Email', 'Nom', 'Prénom', 'Rôle', 'Statut'];
    const tableRows = filteredUsers.map(user => [
      user.email,
      user.last_name || 'N/A',
      user.first_name || 'N/A',
      user.role || 'N/A',
      user.status || 'N/A'
    ]);

    (doc as any).autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped'
    });

    doc.save('liste_utilisateurs.pdf');
  };

  return (
    <div className="space-y-6 relative">
      <Toaster position="top-right" />

      {/* Modal pour ajouter ou éditer un utilisateur */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={handleCloseModal} 
              className="absolute top-4 right-4 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              ✕
            </button>
            <UserForm 
              initialData={modalMode === 'edit' ? selectedUser : undefined}
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Modal pour supprimer un utilisateur */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={handleCloseDeleteModal} 
              className="absolute top-4 right-4 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
              Confirmer la suppression
            </h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">
              Vous êtes sur le point de supprimer l'utilisateur <span className="font-semibold">{selectedUser?.email}</span>. 
              Veuillez entrer votre mot de passe administrateur pour confirmer cette action.
            </p>
            <form onSubmit={handleDeleteSubmit} className="space-y-4">
              <Input
                type="password"
                label="Mot de passe administrateur"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                className="dark:bg-neutral-800 dark:text-white"
              />
              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseDeleteModal}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Suppression...' : 'Supprimer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          Gestion des Utilisateurs
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            icon={<DownloadIcon />}
            onClick={exportToPDF}
          >
            Exporter PDF
          </Button>
          <Button
            variant="primary"
            icon={<PlusIcon />}
            onClick={() => handleOpenModal('add')}
          >
            Ajouter un Utilisateur
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Input
            type="text"
            placeholder="Rechercher des utilisateurs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='dark:text-neutral-800'
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-700">
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Nom</th>
              <th className="p-4 text-left">Prénom</th>
              <th className="p-4 text-left">Rôle</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.last_name || 'N/A'}</td>
                  <td className="p-4">{user.first_name || 'N/A'}</td>
                  <td className="p-4">
                    {user.role === 'admin' ? 'Administrateur' : 
                     user.role === 'create' ? 'Accès création' : 
                     user.role === 'report' ? 'Accès reporting' : 'N/A'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`
                        px-2 py-1 rounded-full text-xs
                        ${user.status === 'Actif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                      `}
                    >
                      {user.status || 'Inactif'}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-2">
                    <Button
                      variant="ghost"
                      icon={<EditIcon className="w-4 h-4" />}
                      onClick={() => handleOpenModal('edit', user)}
                    />
                    <Button
                      variant="ghost"
                      icon={<TrashIcon className="w-4 h-4 text-red-500" />}
                      onClick={() => handleOpenDeleteModal(user)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-neutral-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}