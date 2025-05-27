import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ClubDashboard from "@/components/dashboard/ClubDashboard";
import SocioDashboard from "@/components/dashboard/SocioDashboard";
import DefaultLayout from "@/layouts/default";
import { useAuthStore } from "@/store/auth";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const DashboardPage = () => {
  const user = useAuthStore((state) => state.profile);
  const isAuth = useAuthStore((state) => state.isAuth);

  useEffect(() => {
    console.log("Usuario actual:", user);
    console.log("Estado de autenticación:", isAuth);
  }, [user, isAuth]);

  if (!isAuth || !user) {
    console.log("Redirigiendo al login - No autenticado");
    return <Navigate to="/" replace />;
  }

  const renderDashboard = () => {
    const userRole = user.data?.rol;
    switch (userRole) {
      case "ADMIN":
        return <AdminDashboard />;
      case "CLUB":
        return <ClubDashboard />;
      case "USER":
        return <SocioDashboard />;
      default:
        console.error("Rol no reconocido:", userRole);
        return <Navigate to="/" replace />;
    }
  };

  return (
    <DefaultLayout>
      {renderDashboard()}
    </DefaultLayout>
  );
};

export default DashboardPage;