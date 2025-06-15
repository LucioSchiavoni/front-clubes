import { useQuery } from "@tanstack/react-query";
import { getOrderByUserId, getOrderBySocioId } from "@/api/order";
import { useAuthStore } from "@/store/auth";

export interface Order {
  id: string;
  userId: string;
  total: number;
  dateOrder: string;
  hourOrder: string;
  comment: string;
  status: "PENDING" | "COMPLETED" | "CANCELED";
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      description: string;
      image: string;
      price: number;
      category: string;
      thc: number;
      CBD: number;
      stock: number;
      active: boolean;
      createdAt: string;
      updatedAt: string;
      clubId: string;
    };
  }[];
  user: {
    id: string;
    name: string;
    email: string;
    clubId: string;
  };
}

export const useOrders = (clubId: string) => {
  const { profile } = useAuthStore()
  const socioId = profile?.data?.id;
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', clubId],
    queryFn: async () => {
      const response = profile?.data?.rol === 'CLUB' 
        ? await getOrderByUserId(clubId)
        : await getOrderBySocioId(socioId);
      
      if (response?.data) {
        return response.data;
      }
      return [];
    },
    enabled: !!socioId && !!clubId,
    refetchInterval: 5000, 
  });

  return {
    orders: data || [],
    isLoading,
    error,
  };
}


export const useOrdersBySocio = (socioId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ordersBySocio', socioId],
    queryFn: async () => {
      try {
        const response = await getOrderBySocioId(socioId);
        if (response.data?.message === "No se encontraron órdenes") {
          return {
            orders: [],
            message: response.data.message
          };
        }
        return {
          orders: response.data || [],
          message: null
        };
      } catch (error) {
        throw error;
      }
    },
    enabled: !!socioId,
    refetchInterval: 5000, 
  });

  return {
    orders: data?.orders || [],
    message: data?.message || null,
    isLoading,
    error,
  };
}