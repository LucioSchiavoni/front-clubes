import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ClubDashboard from "@/components/dashboard/ClubDashboard";
import SocioDashboard from "@/components/dashboard/SocioDashboard";
import DefaultLayout from "@/layouts/default";
import { useAuthStore } from "@/store/auth";
import { Navigate } from "react-router-dom";

const DashboardPage = () => {
  const user = useAuthStore((state) => state.profile);
  const isAuth = useAuthStore((state) => state.isAuth);


  if (!isAuth || !user) {
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