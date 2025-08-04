/**
 * 🔗 API Service Hook
 * 
 * This hook handles all communication with the backend API,
 * including prediction requests and error handling.
 */

import { useState, useCallback } from 'react';
import { UserInput, PredictionResponse } from '../types';

interface ApiState {
  loading: boolean;
  error: string | null;
}

interface UseApiReturn extends ApiState {
  predictDestiny: (userData: UserInput) => Promise<PredictionResponse | null>;
  clearError: () => void;
}

// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Vercel serverless functions
  : 'http://localhost:8000/api';  // Local development

export const useApi = (): UseApiReturn => {
  const [state, setState] = useState<ApiState>({
    loading: false,
    error: null
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const predictDestiny = useCallback(async (userData: UserInput): Promise<PredictionResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const prediction: PredictionResponse = await response.json();
      
      // Validate the response structure
      if (!prediction.predicted_lifetime_nw || !prediction.rank_band) {
        throw new Error('Invalid response format from Oracle');
      }

      setLoading(false);
      return prediction;

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'The Oracle is temporarily unavailable. Please try again.';
      
      console.error('API Error:', error);
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, []);

  return {
    ...state,
    predictDestiny,
    clearError
  };
};

// Health check hook for monitoring API status
export const useHealthCheck = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setIsHealthy(response.ok);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      setIsHealthy(false);
      return false;
    }
  }, []);

  return { isHealthy, checkHealth };
};

export default useApi;
