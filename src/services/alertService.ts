
  // src/services/alertService.ts
  

import { Alert, AlertCreatePayload, AlertUpdatePayload, PaginatedResponse } from "@/types/type";
import { BaseApiService } from "./baseApiService";

  
  const BASE_URL = '/panel/alert';
  
  const getAlerts = async (params = {}): Promise<PaginatedResponse<Alert>> => {
    try {
      return await BaseApiService.get(BASE_URL, params);
    } catch (error) {
      throw error;
    }
  };
  
  const getAlertById = async (id: string): Promise<Alert> => {
    try {
      return await BaseApiService.get(`${BASE_URL}/${id}`);
    } catch (error) {
      throw error;
    }
  };
  
  const createAlert = async (data: AlertCreatePayload): Promise<Alert> => {
    try {
      return await BaseApiService.post(BASE_URL, data);
    } catch (error) {
      throw error;
    }
  };
  
  const updateAlert = async (id: string, data: AlertUpdatePayload): Promise<Alert> => {
    try {
      return await BaseApiService.put(`${BASE_URL}/${id}/`, data);
    } catch (error) {
      throw error;
    }
  };
  
  const deleteAlert = async (id: string): Promise<void> => {
    try {
      return await BaseApiService.delete(`${BASE_URL}/${id}/`);
    } catch (error) {
      throw error;
    }
  };
  
  export const alertService = {
    getAlerts,
    getAlertById,
    createAlert,
    updateAlert,
    deleteAlert,
  };