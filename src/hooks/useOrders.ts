import { useQuery } from "@tanstack/react-query";
import { getOrderByUserId } from "@/api/order";
import { useAuthStore } from "@/store/auth";

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
  createdAt: string;
  comment?: string;
  dateOrder: string;
  hourOrder: string;
  user: {
    id: string;
    name: string;
    email: string;
    clubId: string;
  };
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
}

export const useOrders = (clubId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', clubId],
    queryFn: async () => {
      try {
        const response = await getOrderByUserId(clubId);
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
    enabled: !!clubId,
    refetchInterval: 5000, 
  });

  return {
    orders: data?.orders || [],
    message: data?.message || null,
    isLoading,
    error,
  };
}