import { useQuery } from "@tanstack/react-query";
import { getGramsBySocio } from "@/api/order";

export const useGramsBySocio = (userId: string) => {
  return useQuery({
    queryKey: ["gramsBySocio", userId],
    queryFn: () => getGramsBySocio(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}