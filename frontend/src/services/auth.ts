import { apiRequest } from './api';
import type { LoginRequest, LoginResponse, User } from '../types/auth';

const MOCK_USER_KEY = 'ispos.mockUser';
const MOCK_USER: User = {
  id: 'usr_admin',
  username: 'admin',
  roles: ['PAYMENT_OPERATOR'],
};

export const authService = {
  async login(credentials: LoginRequest) {
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(MOCK_USER));
      return {
        user: MOCK_USER,
        accessToken: 'mock-local-token',
      };
    }

    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  async logout() {
    localStorage.removeItem(MOCK_USER_KEY);

    try {
      return await apiRequest<{ success: boolean }>('/auth/logout', {
        method: 'POST',
      });
    } catch {
      return { success: true };
    }
  },

  async me() {
    const storedUser = localStorage.getItem(MOCK_USER_KEY);

    if (storedUser) {
      return JSON.parse(storedUser) as User;
    }

    return apiRequest<User>('/auth/me');
  },
};
