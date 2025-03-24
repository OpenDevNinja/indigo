// departmentService.ts
import { Department } from '@/types/type';
import { BaseApiService } from './baseApiService';

export const DepartmentService = {
  async getAll(): Promise<Department[]> {
    return BaseApiService.get('/panel/commune/');
  },

  async getById(id: string): Promise<Department> {
    return BaseApiService.get(`/panel/commune/${id}`);
  },

  async create(department: Department): Promise<Department> {
    return BaseApiService.post('/panel/commune/', department);
  },

  async update(id: string, department: Department): Promise<Department> {
    return BaseApiService.put(`/panel/commune/${id}/`, department);
  },

  async delete(id: string): Promise<void> {
    return BaseApiService.delete(`/panel/commune/${id}/`);
  }
};