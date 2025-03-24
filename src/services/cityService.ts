// cityService.ts
import { City, PaginatedResponse } from '@/types/type';
import { BaseApiService } from './baseApiService';

export const CityService = {
  async getAll(page: number = 1): Promise<PaginatedResponse<City>> {
    return BaseApiService.get('/panel/city/', { params: { page } });
  },
  async getById(id: string): Promise<City> {
    return BaseApiService.get(`/panel/city/${id}/`);
  },

  async create(city: City): Promise<City> {
    return BaseApiService.post('/panel/city/', city);
  },

  async update(id: string, city: City): Promise<City> {
    return BaseApiService.put(`/panel/city/${id}/`, city);
  },

  async delete(id: string): Promise<void> {
    return BaseApiService.delete(`/panel/city/${id}/`);
  }
};