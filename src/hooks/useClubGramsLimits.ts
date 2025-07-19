import { useQuery } from "@tanstack/react-query"
import { getGramsByClub } from "@/api/club"

export function useClubGramsLimits(clubId?: string | null) {
  return useQuery({
    queryKey: ["club-grams-limits", clubId],
    queryFn: () => (clubId ? getGramsByClub(clubId) : Promise.resolve({ data: { minMonthlyGrams: 0, maxMonthlyGrams: 0 } })),
    enabled: !!clubId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
} 