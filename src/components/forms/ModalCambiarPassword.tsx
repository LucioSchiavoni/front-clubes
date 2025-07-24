import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChangePassword } from "@/hooks/useChangePassword";
import { useAuthStore } from "@/store/auth";

interface ModalCambiarPasswordProps {
  trigger: React.ReactNode;
}

export const ModalCambiarPassword: React.FC<ModalCambiarPasswordProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { mutate, isPending } = useChangePassword();
  const { profile } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }
    const userId = profile?.data?.id;
    if (!userId) {
      setError("No se pudo identificar al usuario.");
      return;
    }
    mutate(
      { userId, currentPassword, newPassword },
      {
        onSuccess: (data: any) => {
          setSuccess(data?.message || "Contraseña cambiada exitosamente.");
          setTimeout(() => {
            setOpen(false);
            setSuccess("");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }, 1500);
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message || "Error al cambiar la contraseña.");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
          <DialogDescription>
            Ingresa tu contraseña actual y la nueva contraseña.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            disabled={isPending}
            required
          />
          <Input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={isPending}
            required
          />
          <Input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={isPending}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Cambiando..." : "Cambiar contraseña"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 