import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePasswordRequest } from "@/api/auth";

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, currentPassword, newPassword }: { userId: string; currentPassword: string; newPassword: string }) =>
      changePasswordRequest(userId, currentPassword, newPassword),
    onSuccess: () => {
      // Invalida queries relacionadas si es necesario
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
} 