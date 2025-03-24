import { PaginatedResponse, PanelGroup } from "@/types/type";
import { BaseApiService } from "./baseApiService";

export const PanelGroupService = {
    async getAll(): Promise<PaginatedResponse<PanelGroup>> {
      return BaseApiService.get('/panel/group/panel/');
    },
  
    async create(panelGroup: PanelGroup): Promise<PanelGroup> {
      return BaseApiService.post('/panel/group/panel/', panelGroup);
    },
  
    async update(id: string, panelGroup: PanelGroup): Promise<PanelGroup> {
      return BaseApiService.put(`/panel/group/panel/${id}/`, panelGroup);
    },
  
    async delete(id: string): Promise<void> {
      return BaseApiService.delete(`/panel/group/panel/${id}/`);
    }
  };