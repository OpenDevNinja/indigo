// countryService.ts
import { Country } from '@/types/type';
import { BaseApiService } from './baseApiService';

export const CountryService = {
  async getAll(): Promise<Country[]> {
    return BaseApiService.get('/panel/country/');
  },

  async create(country: Country): Promise<Country> {
    return BaseApiService.post('/panel/country/', country);
  },

  async update(id: string, country: Country): Promise<Country> {
    return BaseApiService.put(`/panel/country/${id}/`, country);
  },

  async delete(id: string): Promise<void> {
    return BaseApiService.delete(`/panel/country/${id}/`);
  }
};