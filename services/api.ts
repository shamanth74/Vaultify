import axios from 'axios';
import { 
  AddPasswordData, 
  DecryptPasswordData, 
  DeletePasswordData, 
  PasswordEntry, 
  DecryptResponse,
  ApiResponse 
} from '@/types';

// Base API configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Password Management API Services
export const passwordService = {
  // Get all passwords for the current user
  getAllPasswords: async (): Promise<PasswordEntry[]> => {
    const response = await api.get('/passwords');
    return response.data;
  },

  // Add a new password
  addPassword: async (data: AddPasswordData): Promise<ApiResponse> => {
    const response = await api.post('/passwords/add', data);
    return response.data;
  },

  // Decrypt a password
  decryptPassword: async (data: DecryptPasswordData): Promise<ApiResponse & { password?: string }> => {
    const response = await api.post('/passwords/decrypt', data);
    return response.data;
  },

  // Delete a password
  deletePassword: async (data: DeletePasswordData): Promise<ApiResponse> => {
    const response = await api.post('/passwords/delete', data);
    return response.data;
  },
};

// Authentication API Services
export const authService = {
  // Sign up a new user
  signup: async (data: {
    email: string;
    username: string;
    password: string;
    masterPassword: string;
  }): Promise<ApiResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  // Sign in user
  signin: async (data: {
    email: string;
    password: string;
  }): Promise<ApiResponse> => {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
