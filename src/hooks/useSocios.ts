import { useState, useEffect, useCallback } from 'react';
import { getSociosRequest } from '@/api/auth';

interface Socio {
  id: string;
  email: string;
  name: string;
  rol: string;
  phone: string;
  address:string;
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
  const [filteredSocios, setFilteredSocios] = useState<Socio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const getAllSocios = useCallback(async () => {
    if (!clubId) return [];
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await getSociosRequest(clubId);
      const apiResponse = response as ApiResponse;
      
      if (apiResponse.success && Array.isArray(apiResponse.data)) {
        setSocios(apiResponse.data);
        setFilteredSocios(apiResponse.data);
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || 'Error al obtener los socios');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los socios';
      setError(errorMessage);
      console.error('Error al cargar los socios:', err);
      setSocios([]);
      setFilteredSocios([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [clubId]);

  const filterSocios = useCallback(() => {
    let filtered = [...socios];

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(socio => 
        socio.name.toLowerCase().includes(searchLower) || 
        socio.email.toLowerCase().includes(searchLower)
      );
    }

    // Aplicar filtro de estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(socio => 
        statusFilter === 'active' ? socio.active : !socio.active
      );
    }

    setFilteredSocios(filtered);
  }, [socios, searchTerm, statusFilter]);

  useEffect(() => {
    filterSocios();
  }, [filterSocios]);

  useEffect(() => {
    getAllSocios();
  }, [getAllSocios]);

  return {
    socios: filteredSocios,
    isLoading,
    error,
    getAllSocios,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter
  };
}; 