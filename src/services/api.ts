const API_URL = '/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export interface RegistrationData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CardData {
  id?: string;
  workBy: string;
  surveyDate: string;
  federalSubject: string;
  markerIndex: string;
  markerName: string;
  placingYear: number;
  signHeight: number;
  centerType: string;
  altitude: number;
  trapezes: string;
  coordinates: string;
  signMainType: string;
  signalType?: string;
  signMaterial?: string;
  signSides?: string;
  postType?: string;
  signPresence: string;
  monolith1Integrity: string;
  monolith2Openness: string;
  monoliths3And4Openness: string;
  outerSignIntegrity: string;
  orp1Integrity: string;
  orp2Integrity: string;
  trenchReadability: string;
  satelliteObservability: string;
  upperMarkBelowGroundHeight: number;
  exteriorPhoto?: File | null;
  centerMarkPhoto?: File | null;
  extraNotes: string;
  createdBy: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
}

export interface SurveyCard {
  id: string;
  markerName: string;
  federalSubject: string;
  markerIndex: string;
  surveyDate: string;
  workBy: string;
  createdBy: string;
  status?: string;
  images?: string[];
}

export const api = {
  async register(data: RegistrationData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch('/auth/registration', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Ошибка регистрации' };
      }

      const responseData = await response.json();
      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
      }

      return { success: true, data: responseData };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Ошибка при подключении к серверу' };
    }
  },

  async login(data: LoginData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Ошибка входа' };
      }

      const responseData = await response.json();
      if (!responseData.token) {
        return { success: false, error: 'Токен не получен от сервера' };
      }

      localStorage.setItem('token', responseData.token);
      return { success: true, data: responseData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Ошибка при подключении к серверу' };
    }
  },

  createCard: async (data: FormData | CardData): Promise<ApiResponse<CardData>> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await fetch('/surveys', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' })
        },
        body: data instanceof FormData ? data : JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Internal server error');
      }

      const responseData = await response.json();
      return { success: true, data: responseData };
    } catch (error) {
      console.error('Error creating card:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Internal server error' };
    }
  },

  async updateCard(id: string, data: CardData): Promise<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const response = await fetch(`/surveys/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return { success: false, error: responseData.message || 'Ошибка обновления карточки' };
    }

    return { success: true, data: responseData };
  },

  async checkAuth(): Promise<{ email: string; role: string; isAuthenticated: boolean; message: string }> {
    try {
      const token = localStorage.getItem('token');
      console.log('Checking auth with token:', token);
      
      if (!token) {
        console.log('No token found');
        return { 
          email: '', 
          role: '', 
          isAuthenticated: false, 
          message: 'Токен не найден' 
        };
      }

      const response = await fetch('/auth/check', {
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });

      if (!response.ok) {
        console.log('Auth check failed with status:', response.status);
        localStorage.removeItem('token');
        const errorData = await response.json();
        return { 
          email: '', 
          role: '', 
          isAuthenticated: false, 
          message: errorData.message || 'Ошибка авторизации' 
        };
      }

      const responseData = await response.json();
      console.log('Auth check response data:', responseData);
      return responseData;
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      return { 
        email: '', 
        role: '', 
        isAuthenticated: false, 
        message: 'Ошибка при проверке авторизации' 
      };
    }
  },

  async checkAdmin(): Promise<ApiResponse<{ role: string }>> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await fetch('/auth/check-admin', {
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to check admin status' };
      }

      return { success: true, data: await response.json() };
    } catch (error) {
      console.error('Admin check error:', error);
      return { success: false, error: 'Ошибка при проверке прав администратора' };
    }
  },

  async getSurveys(): Promise<ApiResponse<SurveyCard[]>> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await fetch('/surveys', {
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to fetch surveys' };
      }

      return { success: true, data: await response.json() };
    } catch (error) {
      console.error('Get surveys error:', error);
      return { success: false, error: 'Ошибка при получении списка карточек' };
    }
  },

  async getSurvey(id: string): Promise<ApiResponse<SurveyCard>> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await fetch(`/surveys/${id}`, {
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to fetch survey' };
      }

      return { success: true, data: await response.json() };
    } catch (error) {
      console.error('Get survey error:', error);
      return { success: false, error: 'Ошибка при получении карточки' };
    }
  },

  async deleteSurvey(id: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await fetch(`/surveys/${id}`, {
        method: 'DELETE',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to delete survey' };
      }

      return { success: true };
    } catch (error) {
      console.error('Delete survey error:', error);
      return { success: false, error: 'Ошибка при удалении карточки' };
    }
  },

  async updateSurveyStatus(id: string, status: string): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const response = await fetch(`/api/surveys/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to update survey status' };
    }

    return { success: true };
  },
}; 