import { ReactNode } from "react";
import { verifySession } from "@/features/auth/session";
import { redirect } from "next/navigation";
import { getServiceSupabase } from "@/lib/supabase";
import Sidebar from "@/components/common/Sidebar";
import DashboardLayoutWrapper from "@/components/common/DashboardLayoutWrapper";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await verifySession();

  if (!session?.userId) {
    redirect("/auth");
  }

  // Redirect Super Admin to their own panel if they end up here
  if (session.isSuper) {
    redirect("/admin");
  }

  // Redirect to onboarding if no company is associated
  if (!session.companyId) {
    redirect("/onboarding/create-company");
  }

  const adminSupabase = getServiceSupabase();
  const { data: company } = await adminSupabase
    .from("Company")
    .select("name")
    .eq("id", session.companyId)
    .single();

  const dashboardMenuItems = [
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Inventario", href: "/dashboard/inventario", icon: "inventory_2" },
    { label: "Mi Equipo", href: "/dashboard/usuarios", icon: "group" },
    { label: "Ventas & Pagos", href: "/dashboard/ventas", icon: "payments" },
    { label: "Informes", href: "/dashboard/informes", icon: "bar_chart" },
  ];

  const sidebar = (
    <Sidebar 
      title="Boutique Manager" 
      subtitle={company?.name || "Cargando..."} 
      items={dashboardMenuItems} 
      homeHref="/dashboard" 
    />
  );

  return (
    <DashboardLayoutWrapper sidebar={sidebar} headerTitle={company?.name || "Atelier"}>
      {children}
    </DashboardLayoutWrapper>
  );
}
