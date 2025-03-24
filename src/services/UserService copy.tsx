import { BaseApiService } from "./baseApiService";
import { RegisterUserData } from "./AuthService";
import { toast } from 'react-hot-toast';

export interface DeleteUserData {
  user_id: string;
  password: string;
}
export interface UserData {
 
  last_name?: string;
  first_name?: string;
  email?: string;
  phone?: string;
  phone_indi?: string;
  role?: 'report' | 'create' | 'admin';
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
    return BaseApiService.post('/auth/user/register/', userData);
  },
  
  async updateUser(updateData: Partial<RegisterUserData>) {
    if (!BaseApiService.isAdmin()) {
      toast.error('Vous n\'avez pas les permissions nécessaires');
      throw new Error('Unauthorized');
    }
    return BaseApiService.put('/auth/user/update_user/', updateData);
  },
  
  async deleteUser(deleteData: { user_id: string; password: string }) {
    if (!BaseApiService.isAdmin()) {
      toast.error('Vous n\'avez pas les permissions nécessaires');
      throw new Error('Unauthorized');
    }
    return BaseApiService.delete('/auth/user/delete/', deleteData);
  },
  
  async listUsers(): Promise<{ results: UserData[] }> {
    return BaseApiService.get('/auth/user/list_user/');
  },
  
  async getCurrentUser() {
    return BaseApiService.get('/auth/user/me/');
  },
};