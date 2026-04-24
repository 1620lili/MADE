import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import UsersTable from "@/components/users/UsersTable";
import UserFilters from "./UserFilters";
import RoleManagementWrapper from "./RoleManagementWrapper";

export const metadata = {
  title: "Usuarios & Permisos | LUXE ATELIER",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string; roleId?: string; isActive?: string }>;
}) {
  const session = await verifySession();
  const { companyId, roleId, isActive } = await searchParams;

  if (!session || !session.isSuper) {
    redirect("/auth");
  }

  const adminSupabase = getServiceSupabase();

  // 1. Fetch Companies for filter
  const { data: companies } = await adminSupabase
    .from("Company")
    .select("id, name")
    .eq("isActive", true)
    .order("name");

  // 2. Fetch Roles and Permissions for Management Modal
  const { data: roles } = await adminSupabase
    .from("Role")
    .select(`
      id,
      name,
      RolePermission (
        permissionId
      )
    `)
    .order("name");

  const { data: permissions } = await adminSupabase
    .from("Permission")
    .select("*")
    .order("name");

  // 3. Fetch Users with filtering
  let query = adminSupabase
    .from("User")
    .select(`
      id,
      email,
      fullName,
      isSuper,
      isActive,
      createdAt,
      Company (
        name
      ),
      UserRole (
        Role (
          name
        )
      )
    `)
    .order("createdAt", { ascending: false });

  if (companyId) query = query.eq("companyId", companyId);
  if (isActive === "true") query = query.eq("isActive", true);
  if (isActive === "false") query = query.eq("isActive", false);

  const { data: users, error } = await query;

  if (error) console.error("Users Fetch Error:", error);

  return (
    <div className="space-y-12">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 border-b border-outline-variant/20 pb-10">
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-secondary">
             <span className="material-symbols-outlined text-sm">group</span>
             <span className="font-label text-[10px] uppercase tracking-[0.4em]">Directorio de Acceso</span>
           </div>
           <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Usuarios y Permisos</h1>
           <p className="text-on-surface-variant font-body text-lg max-w-xl">
             Control de identidades y privilegios. Administración de roles globales y de boutique.
           </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 lg:items-center">
           <RoleManagementWrapper roles={roles || []} permissions={permissions || []} />
           
           <Link 
             href="/admin/usuarios/nuevo" 
             className="bg-on-surface text-surface px-8 py-4 text-[10px] tracking-widest uppercase font-label font-bold hover:bg-secondary transition-all shadow-lg hover:shadow-secondary/20 flex items-center space-x-3"
           >
             <span className="material-symbols-outlined text-sm">person_add</span>
             <span>Crear Usuario</span>
           </Link>
        </div>
      </header>

      {/* Filtros */}
      <UserFilters 
        companies={companies || []} 
        companyId={companyId} 
        isActive={isActive} 
      />

      <section>
        <UsersTable users={(users as any) || []} />
      </section>
    </div>
  );
}
