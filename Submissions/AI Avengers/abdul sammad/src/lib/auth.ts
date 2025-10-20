import { useAuth } from '@clerk/clerk-react';

export const useProtectedFetch = () => {
  const { getToken } = useAuth();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      // Get the JWT token from Clerk
      const token = await getToken();

      // Add the token to the headers
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };

      // Make the request
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Protected fetch error:', error);
      throw error;
    }
  };

  return { fetchWithAuth };
};