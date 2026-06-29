import { ReactNode } from "react";
import { verifySession } from "@/features/auth/session";
import { redirect } from "next/navigation";
import { getServiceSupabase } from "@/lib/supabase";
import Sidebar from "@/components/common/Sidebar";
import DashboardLayoutWrapper from "@/components/common/DashboardLayoutWrapper";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await verifySession();

  if (!session || !session.isSuper) {
    redirect("/auth");
  }

  const adminMenuItems = [
    { label: "Dashboard", href: "/admin", icon: "dashboard" },
    { label: "Empresas", href: "/admin/empresas", icon: "store" },
    { label: "Inventario", href: "/admin/inventario", icon: "inventory_2" },
    { label: "Usuarios & Roles", href: "/admin/usuarios", icon: "group" },
    { label: "Ventas & Pagos", href: "/admin/ventas", icon: "payments" },
    { label: "Informes", href: "/admin/informes", icon: "bar_chart" },
  ];

  const sidebar = (
    <Sidebar 
      title="Store Manager" 
      subtitle="Maison de Luxe" 
      items={adminMenuItems} 
      homeHref="/admin" 
      userName={session.fullName}
      userEmail={session.email}
    />
  );

  return (
    <DashboardLayoutWrapper 
      sidebar={sidebar} 
      headerTitle="Luxe Atelier Admin"
      userName={session.fullName}
      session={session}
    >
      {children}
    </DashboardLayoutWrapper>
  );
}
