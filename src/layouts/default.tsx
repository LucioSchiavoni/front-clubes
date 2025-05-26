import Navbar from "@/components/navbar/Navbar";


export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = useAuthStore((state) => state.user);

  if (!user) return null; // O redirección o loader


  return (
    <div className="layout">
    <Navbar role={user.role} />
    <main>{children}</main>
  </div>
  );
}
