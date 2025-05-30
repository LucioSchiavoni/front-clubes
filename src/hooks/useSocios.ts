import { useState, useEffect, useCallback } from 'react';
import { getSociosRequest } from '@/api/auth';

interface Socio {
  id: string;
  email: string;
  name: string;
  rol: string;
  active: boolean;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Socio[];
}

export const useSocios = (clubId: string) => {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllSocios = useCallback(async () => {
    if (!clubId) return [];
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await getSociosRequest(clubId);
      const apiResponse = response as ApiResponse;
      
      if (apiResponse.success && Array.isArray(apiResponse.data)) {
        setSocios(apiResponse.data);
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || 'Error al obtener los socios');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los socios';
      setError(errorMessage);
      console.error('Error al cargar los socios:', err);
      setSocios([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    getAllSocios();
  }, [getAllSocios]);

  return {
    socios,
    isLoading,
    error,
    getAllSocios
  };
}; 