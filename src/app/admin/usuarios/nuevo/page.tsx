import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import CreateUserForm from "@/components/users/CreateUserForm";

export const metadata = {
  title: "Nuevo Usuario | LUXE ATELIER",
};

export default async function AdminNewUserPage() {
  const session = await verifySession();

  if (!session || !session.isSuper) {
    redirect("/auth");
  }

  const adminSupabase = getServiceSupabase();
  
  // 1. Fetch Companies
  const { data: companies } = await adminSupabase
    .from("Company")
    .select("id, name")
    .eq("isActive", true)
    .order("name");

  // 2. Fetch Roles with their permissions
  const { data: roles } = await adminSupabase
    .from("Role")
    .select(`
      id,
      name,
      RolePermission (
        Permission (
          name
        )
      )
    `)
    .order("name");

  return (
    <div className="space-y-12">
      <header className="border-b border-outline-variant/20 pb-10">
        <div className="flex items-center space-x-3 text-secondary mb-4">
          <span className="material-symbols-outlined text-sm">person_add</span>
          <span className="font-label text-[10px] uppercase tracking-[0.4em]">Gestión de Personal</span>
        </div>
        <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Alta de Colaborador</h1>
        <p className="text-on-surface-variant font-body text-lg max-w-xl mt-4">
          Registra un nuevo miembro en el sistema global. Podrás asignarlo a una boutique y definir su rol operativo.
        </p>
      </header>

      <section className="bg-surface-lowest p-12 border border-outline-variant/10 shadow-sm">
        <CreateUserForm 
          companies={companies || []} 
          roles={(roles as any) || []} 
          isSuper={true} 
        />
      </section>
    </div>
  );
}
