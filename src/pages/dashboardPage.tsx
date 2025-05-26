

import { Navigate } from 'react-router-dom';

import ClubDashboard from '@/components/dashboard/ClubDashboard';
import SocioDashboard from '@/components/dashboard/SocioDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import DefaultLayout from '@/layouts/default';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" />;

  let dashboardContent;

  switch (user.role) {
    case 'ADMIN':
      dashboardContent = <AdminDashboard />;
      break;
    case 'CLUB':
      dashboardContent = <ClubDashboard />;
      break;
    case 'USER':
      dashboardContent = <SocioDashboard />;
      break;
    default:
      dashboardContent = <p>Rol no reconocido</p>;
  }

  return <DefaultLayout>{dashboardContent}</DefaultLayout>;
};

export default DashboardPage;
