import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ClubDashboard from "@/components/dashboard/ClubDashboard";
import SocioDashboard from "@/components/dashboard/SocioDashboard";
import DefaultLayout from "@/layouts/default";
import { useAuthStore } from "@/store/auth";
import { Navigate } from "react-router-dom";

const DashboardPage = () => {
  const user = useAuthStore((state) => state.profile);

  if (!user) return <Navigate to="/" />;

  let dashboardContent;
  switch (user.rol) {
    case "ADMIN":
      dashboardContent = <AdminDashboard/>
      break;
    case "CLUB":
      dashboardContent = <ClubDashboard />;
      break;
    case "USER":
      dashboardContent = <SocioDashboard />;
      break;
    default:
      dashboardContent = <p>Rol no reconocido</p>;
  }

  return <DefaultLayout>{dashboardContent}</DefaultLayout>;
};

export default DashboardPage;