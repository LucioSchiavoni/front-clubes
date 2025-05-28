import { useQuery } from "@tanstack/react-query"
import { getClubById } from "@/api/club"
import { useAuthStore } from "@/store/auth"

export const useClub = () => {
  const { profile } = useAuthStore()
  const clubId = profile?.data?.clubId

  const { data: club, isLoading, error } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => getClubById(clubId as string),
    enabled: !!clubId, 
  })

  return {
    club: club?.data,
    isLoading,
    error,
    isClubActive: club?.data?.active
  }
} 