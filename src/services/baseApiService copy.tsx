//service/baseApiService.tsx
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

const getToken = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  console.log('Token récupéré:', token);
  return token;
};

const isAdmin = () => {
  const token = getToken();
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role === 'admin';
    } catch (error) {
      return false;
    }
  }
  return false;
};

const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://panel.codelabbenin.com",
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');

  // Excluez les routes d'authentification de l'ajout du header Authorization
  if (token && !config.url?.includes('/auth/user/login/')) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

const handleError = (error: any) => {
  console.error('Erreur API détaillée:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message
  });

  if (error.response?.status === 401 && error.response?.data?.detail) {
    throw new Error(error.response.data.detail || 'Identifiants incorrects');
  }

  throw error.response?.data || error.message;
};

const get = async (url: string, params = {}) => {
  try {
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const post = async (url: string, data: any) => {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const put = async (url: string, data: any) => {
  try {
    const response = await apiClient.put(url, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const patch = async (url: string, data: any) => {
  try {
    const response = await apiClient.patch(url, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const remove = async (url: string, data?: any) => {
  try {
    const response = await apiClient.delete(url, { data });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const BaseApiService = {
  get,
  post,
  put,
  patch,
  delete: remove,
  setToken,
  getToken,
  removeToken,
  isAdmin,
};