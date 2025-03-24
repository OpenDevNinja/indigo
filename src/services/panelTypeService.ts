// panelTypeService.ts
import { PanelType } from '@/types/type';
import { BaseApiService } from './baseApiService';

export const PanelTypeService = {
  async getAll(): Promise<PanelType[]> {
    return BaseApiService.get('/panel/type/panel/');
  },

  async create(panelType: PanelType): Promise<PanelType> {
    return BaseApiService.post('/panel/type/panel/', panelType);
  },

  async update(id: string, panelType: PanelType): Promise<PanelType> {
    return BaseApiService.put(`/panel/type/panel/${id}/`, panelType);
  },

  async delete(id: string): Promise<void> {
    return BaseApiService.delete(`/panel/type/panel/${id}/`);
  }
};

