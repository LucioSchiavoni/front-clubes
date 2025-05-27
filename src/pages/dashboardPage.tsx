import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ClubDashboard from "@/components/dashboard/ClubDashboard";
import SocioDashboard from "@/components/dashboard/SocioDashboard";
import DefaultLayout from "@/layouts/default";
import { useAuthStore } from "@/store/auth";
import { Navigate } from "react-router-dom";

const DashboardPage = () => {
  const user = useAuthStore((state) => state.profile);

  if (!user) return <Navigate to="/" />;
  console.log("user:", user); // <-- Agrega esto
  console.log("user.rol:", user?.rol);


  return <DefaultLayout>   
    {user.rol === "ADMIN" && <AdminDashboard />}
  {user.rol === "CLUB" && <ClubDashboard />}
  {user.rol === "USER" && <SocioDashboard />}
  </DefaultLayout>;
};

export default DashboardPage;