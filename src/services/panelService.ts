// panelService.ts
import { PaginatedResponse, PanelApiPayload,  } from '@/types/type';
import { BaseApiService } from './baseApiService';
import { Panel } from '@/types/panel';
//import { Panel, PanelCreateUpdate, PaginatedResponse } from './types';

export const PanelService = {
  /**
   * Get all panels with pagination
   */
  async getAll(): Promise<PaginatedResponse<Panel>> {
    return BaseApiService.get('/panel/panel');
  },

  /**
   * Get a specific panel by ID
   */
  async getById(id: string): Promise<Panel> {
    return BaseApiService.get(`/panel/panel/${id}/`);
  },

  /**
   * Create a new panel
   */
  async create(panel: PanelCreateUpdate): Promise<Panel> {
    return BaseApiService.post('/panel/panel', panel);
  },

  /**
   * Update an existing panel
   */
 // Dans panelService.ts
async update(id: string, panel: PanelApiPayload): Promise<Panel> {
  // Utilisez une approche différente pour l'URL ou le formatage des données
  try {
    // Essayez avec le format d'URL avec slash
    return await BaseApiService.put(`/panel/panel/${id}/`, panel);
  } catch (error) {
    console.error("Première tentative échouée, essai avec un format alternatif", error);
    
    // Si cela échoue, essayez sans le slash final
    return BaseApiService.put(`/panel/panel/${id}`, panel);
  }
},

  /**
   * Patch an existing panel with partial data
   */
  async patch(id: string, panel: Partial<PanelCreateUpdate>): Promise<Panel> {
    return BaseApiService.patch(`/panel/panel/${id}/`, panel);
  },

  /**
   * Delete a panel
   */
  async delete(id: string): Promise<void> {
    return BaseApiService.delete(`/panel/panel/${id}/`);
  }
};