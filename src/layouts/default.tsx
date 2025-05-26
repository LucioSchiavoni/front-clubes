import Navbar from "@/components/navbar/Navbar";
import { useAuthStore } from "@/store/auth";


export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = useAuthStore((state) => state.profile);

  if (!user) return null; 


  return (
    <div className="layout">
    <Navbar role={user.role} />
    <main>{children}</main>
  </div>
  );
}
