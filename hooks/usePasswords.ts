import { useState, useEffect } from 'react';
import { PasswordEntry } from '@/types';
import { passwordService } from '@/services/api';

export const usePasswords = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPasswords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await passwordService.getAllPasswords();
      setPasswords(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch passwords');
    } finally {
      setLoading(false);
    }
  };

  const addPassword = async (passwordData: {
    platform: string;
    platform_url?: string;
    platform_username?: string;
    password: string;
    master_password: string;
  }) => {
    try {
      await passwordService.addPassword(passwordData);
      await fetchPasswords(); // Refresh the list
      return { success: true };
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to add password' 
      };
    }
  };

  const deletePassword = async (passwordId: string, masterPassword: string) => {
    try {
      await passwordService.deletePassword({ passwordId, masterPassword });
      await fetchPasswords(); // Refresh the list
      return { success: true };
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to delete password' 
      };
    }
  };

  const decryptPassword = async (passwordId: string, masterPassword: string) => {
    try {
      const result = await passwordService.decryptPassword({ passwordId, masterPassword });
      if (result.success && result.password) {
        return { success: true, password: result.password };
      } else {
        return { 
          success: false, 
          error: result.error || 'Failed to decrypt password' 
        };
      }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to decrypt password' 
      };
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  return {
    passwords,
    loading,
    error,
    fetchPasswords,
    addPassword,
    deletePassword,
    decryptPassword,
  };
};
