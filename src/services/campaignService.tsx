import { Campaign, CampaignCreateUpdate, PaginatedResponse } from '@/types/type';
import { BaseApiService } from './baseApiService';

export const CampaignService = {
  /**
   * Get all campaigns with pagination and filters
   */
  async getAll(params?: URLSearchParams): Promise<PaginatedResponse<Campaign>> {
    const url = params ? `/panel/campaign?${params.toString()}` : '/panel/campaign';
    return BaseApiService.get(url);
  },

  /**
   * Get a specific campaign by ID
   */
  async getById(id: string): Promise<Campaign> {
    return BaseApiService.get(`/panel/campaign/${id}/`);
  },

  /**
   * Create a new campaign
   */
  async create(campaign: any): Promise<Campaign> {
    // Assurez-vous que le format correspond à ce que l'API attend
    return BaseApiService.post('/panel/campaign/', campaign);
  },

  /**
   * Update an existing campaign
   */
  async update(id: string, campaign: any): Promise<Campaign> {
    return BaseApiService.put(`/panel/campaign/${id}/`, campaign);
  },

  /**
   * Delete a campaign
   */
  async delete(id: string): Promise<void> {
    return BaseApiService.delete(`/panel/campaign/${id}/`);
  }
};