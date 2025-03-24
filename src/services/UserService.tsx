import { BaseApiService } from "./baseApiService";
import { RegisterUserData } from "./AuthService";
import { toast } from 'react-hot-toast';

export interface DeleteUserData {
  user_id: string;
  password: string;
}

export interface UserData {
  id?: string;
  last_name?: string;
  first_name?: string;
  email?: string;
  phone?: string;
  phone_indi?: string;
  role?: 'report' | 'create' | 'admin';
  status?: string;
}

export interface UpdateUserData {
  last_name?: string;
  first_name?: string;
  email?: string;
  phone?: string;
  phone_indi?: string;
  role?: 'report' | 'create' | 'admin';
}

export const UserService = {
  async createUser(userData: RegisterUserData) {
    try {
      return await BaseApiService.post('/auth/user/register/', userData);
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  },
  
  async updateUser(updateData: Partial<RegisterUserData>) {
    if (!BaseApiService.isAdmin()) {
      const error = new Error('Vous n\'avez pas les permissions nécessaires');
      (error as any).detail = 'Vous n\'avez pas les permissions nécessaires';
      throw error;
    }
    
    try {
      return await BaseApiService.put('/auth/user/update_user/', updateData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },
  
  async deleteUser(deleteData: DeleteUserData) {
    if (!BaseApiService.isAdmin()) {
      const error = new Error('Vous n\'avez pas les permissions nécessaires');
      (error as any).detail = 'Vous n\'avez pas les permissions nécessaires';
      throw error;
    }
    
    try {
      return await BaseApiService.delete('/auth/user/delete/', deleteData);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  },
  
  async listUsers(): Promise<{ results: UserData[] }> {
    try {
      return await BaseApiService.get('/auth/user/list_user/');
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },
  
  async getCurrentUser() {
    try {
      return await BaseApiService.get('/auth/user/me/');
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur courant:', error);
      throw error;
    }
  },
};