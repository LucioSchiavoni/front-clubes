import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSociosRequest } from '@/api/auth';

interface Socio {
  id: string;
  email: string;
  name: string;
  rol: string;
  phone: string;
  address: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const { data: socios = [], isLoading, error, refetch } = useQuery({
    queryKey: ['socios', clubId],
    queryFn: async () => {
      if (!clubId) return [];
      const response = await getSociosRequest(clubId);
      const apiResponse = response as ApiResponse;
      
      if (apiResponse.success && Array.isArray(apiResponse.data)) {
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || 'Error al obtener los socios');
      }
    },
    enabled: !!clubId
  });

  const filteredSocios = socios.filter(socio => {
    const matchesSearch = searchTerm === '' || 
      socio.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      socio.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' ? socio.active : !socio.active);

    return matchesSearch && matchesStatus;
  });

  return {
    socios: filteredSocios,
    isLoading,
    error: error as Error | null,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    refetch
  };
}; 