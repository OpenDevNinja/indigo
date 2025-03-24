// communeService.ts
import { Commune, PaginatedResponse } from '@/types/type';
import { BaseApiService } from './baseApiService';

export const CommuneService = {
  async getAll(page: number = 1): Promise<PaginatedResponse<Commune>> {
    return BaseApiService.get('/panel/commune/', { page });
  },

  async getById(id: string): Promise<Commune> {
    return BaseApiService.get(`/panel/commune/${id}`);
  },

  async create(commune: { name: string; country_id: string }): Promise<Commune> {
    return BaseApiService.post('/panel/commune/', commune);
  },

  async update(id: string, commune: { name: string; country_id: string }): Promise<Commune> {
    return BaseApiService.put(`/panel/commune/${id}/`, commune);
  },

  async delete(id: string): Promise<void> {
    return BaseApiService.delete(`/panel/commune/${id}/`);
  }
};