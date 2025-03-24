// src/services/AuthService.ts
import { LoginResponse } from "@/types/type";
import { BaseApiService } from "./baseApiService";

/**
 * Interface pour les données d'enregistrement d'un utilisateur
 */
export interface RegisterUserData {
  email: string;
  first_name: string;
  last_name: string;
  phone_indi: string;
  phone: string;
  role: string;
}

/**
 * Interface pour les données de connexion
 */
export interface LoginData {
  email: string;
  password: string;
}


/**
 * Service d'authentification avec méthodes principales
 */
export const AuthService = {
 

  /**
   * Connecte un utilisateur
   * @param loginData Identifiants de connexion
   */

  async login(loginData: LoginData) {
    try {
      const response = await BaseApiService.post<LoginResponse>('/auth/user/login/', loginData);
  
      if (response?.access) {  
        BaseApiService.setToken(response.access); // Utilisez la méthode setToken pour stocker le token
      }
  
      return response;
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      throw new Error(error.response?.data?.detail || 'Échec de la connexion');
    }
  },
 
  /**
   * Déconnecte l'utilisateur
   */
  logout() {
    BaseApiService.removeToken();
  }
};