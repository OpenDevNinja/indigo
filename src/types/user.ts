import { RegisterUserData } from "@/services/AuthService"

// src/types/user.ts
export interface User {
  id?: string;
  last_name?: string;
  first_name?: string;
  email?: string;
  phone?: string;
  phone_indi?: string;
  role?: 'report' | 'create' | 'admin';
  status?: string;
  }
  export interface UserData extends RegisterUserData {
    id: string;
    status: 'Actif' | 'Inactif';
  }