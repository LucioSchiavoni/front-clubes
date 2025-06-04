import { useQuery } from "@tanstack/react-query";
import { getOrderByUserId } from "@/api/order";
import { useAuthStore } from "@/store/auth";

export const useOrders = () => {
  const { profile } = useAuthStore();
  const userId = profile?.data?.id;


  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', userId],
    queryFn: () => getOrderByUserId(userId as string),
    enabled: !!userId, 
  });

  return {
    orders: data || [],
    isLoading,
    error,
  };
}