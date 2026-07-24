import { useAuthContext } from '../contexts/AuthContext';
import { AuthContextType } from '../types/auth';

/**
 * Custom hook to access Supabase authentication context
 */
export const useAuth = (): AuthContextType => {
  return useAuthContext();
};
