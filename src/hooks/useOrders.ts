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
      const response = await getOrderByUserId(clubId);
      return response.data || [];
    },
    enabled: !!clubId,
    refetchInterval: 5000, 
  });

  return {
    orders: data || [],
    isLoading,
    error,
  };
}