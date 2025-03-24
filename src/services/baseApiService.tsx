import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

const getToken = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  return token;
};

const isAdmin = () => {
  const token = getToken();
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role === 'admin';
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
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
  const token = getToken();
  
  // Excluez les routes d'authentification de l'ajout du header Authorization
  if (token && !config.url?.includes('/auth/user/login/')) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercepteur de réponse pour gérer les erreurs communes
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer l'expiration du token
    if (error.response?.status === 401 && !error.config.url.includes('/auth/user/login/')) {
      // Le token a expiré ou est invalide, on déconnecte l'utilisateur
      removeToken();
      // Rediriger vers la page de connexion si nécessaire
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const handleError = (error: any) => {
  console.error('Erreur API détaillée:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message
  });

  // Créer un objet d'erreur enrichi
  const enhancedError = new Error(error.message);
  
  // Ajouter des propriétés supplémentaires à l'erreur
  if (error.response?.data) {
    (enhancedError as any).detail = error.response.data.detail || error.response.data.message || error.message;
    (enhancedError as any).statusCode = error.response.status;
    (enhancedError as any).responseData = error.response.data;
  }

  throw enhancedError;
};

const get = async <T>(url: string, params = {}): Promise<T> => {
  try {
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const post = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const put = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response = await apiClient.put(url, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const patch = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response = await apiClient.patch(url, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const remove = async <T>(url: string, data?: any): Promise<T> => {
  try {
    const response = await apiClient.delete(url, { data });
    return response.data;
  } catch (error) {
    return handleError(error);
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