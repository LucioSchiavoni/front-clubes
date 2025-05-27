import Navbar from "@/components/navbar/Navbar";
import { useAuthStore } from "@/store/auth";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const user = useAuthStore((state) => state.profile);

  return (
    <div className="flex h-screen ">
      {/* Navbar lateral */}
      <div className="">
        <Navbar rol={user?.data?.rol} />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        <main className="h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
