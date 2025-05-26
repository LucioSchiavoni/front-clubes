import Navbar from "@/components/navbar/Navbar";
import { useAuthStore } from "@/store/auth";


export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = useAuthStore((state) => state.profile);



  return (
    <div className="layout">
    <Navbar rol={user?.rol} />
   {children}
  </div>
  );
}
