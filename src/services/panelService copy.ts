import { PaginatedResponse, Panel, PanelApiPayload } from '@/types/type';
import { BaseApiService } from './baseApiService';

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
  async create(panel: PanelApiPayload): Promise<Panel> {
    // Format the data for creation
    const formattedData = {
      ...panel,
      country_id: panel.country_id || panel.city_id // Ensure country_id is included
    };
    return BaseApiService.post('/panel/panel', formattedData);
  },

  /**
   * Update an existing panel
   */
  async update(id: string, panel: PanelApiPayload): Promise<Panel> {
    // Ensure all required fields are present in the update payload
    const formattedData = {
      ...panel,
      // Make sure these IDs are included and properly formatted
      type_pannel_id: panel.type_pannel_id,
      group_pannel_id: panel.group_pannel_id,
      city_id: panel.city_id,
      commune_id: panel.commune_id,
      country_id: panel.country_id,
      // Include other required fields
      surface: panel.surface,
      quantity: panel.quantity,
      face_number: panel.face_number,
      sense: panel.sense,
      description: panel.description
    };

    // Log the formatted data before sending
    console.log('Formatted update payload:', formattedData);
    
    return BaseApiService.put(`/panel/panel/${id}/`, formattedData);
  },

  /**
   * Delete a panel
   */
  async delete(id: string): Promise<void> {
    return BaseApiService.delete(`/panel/panel/${id}/`);
  }
};