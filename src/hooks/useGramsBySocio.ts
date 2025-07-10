import { useQuery } from "@tanstack/react-query";
import { getGramsBySocio } from "@/api/order";

export const useGramsBySocio = (userId: string) => {
  return useQuery({
    queryKey: ["gramsBySocio", userId],
    queryFn: async () => {
      const response = await getGramsBySocio(userId);
      return response.data || [];
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}