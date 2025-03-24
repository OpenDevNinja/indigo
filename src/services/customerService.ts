// customerService.ts
import { Customer, CustomerFormData, PaginatedResponse } from '@/types/type';
import { BaseApiService } from './baseApiService';

export const CustomerService = {
  async getAll(): Promise<PaginatedResponse<Customer>> {
    return BaseApiService.get('/panel/customer/');
  },

  async create(customer: CustomerFormData): Promise<Customer> {
    return BaseApiService.post('/panel/customer/', customer);
  },

  async update(id: string, customer: CustomerFormData): Promise<Customer> {
    return BaseApiService.put(`/panel/customer/${id}/`, customer);
  },

  async delete(id: string): Promise<void> {
    return BaseApiService.delete(`/panel/customer/${id}/`);
  }
};