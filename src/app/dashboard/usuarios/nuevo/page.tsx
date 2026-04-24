import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import CreateUserForm from "@/components/users/CreateUserForm";

export const metadata = {
  title: "Invitar Miembro | LUXE ATELIER",
};

export default async function CompanyNewUserPage() {
  const session = await verifySession();

  if (!session || !session.companyId) {
    redirect("/auth");
  }

  const adminSupabase = getServiceSupabase();
  
  // Fetch Roles excluding administrative system roles
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
    .not("name", "in", '("SUPER_ADMIN","COMPANY_ADMIN")')
    .order("name");

  return (
    <div className="space-y-12">
      <header className="border-b border-outline-variant/20 pb-10">
        <div className="flex items-center space-x-3 text-secondary mb-4">
          <span className="material-symbols-outlined text-sm">person_add_check</span>
          <span className="font-label text-[10px] uppercase tracking-[0.4em]">Expansión de Equipo</span>
        </div>
        <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Invitar Colaborador</h1>
        <p className="text-on-surface-variant font-body text-lg max-w-xl mt-4">
          Añade un nuevo profesional a tu boutique. Define sus atribuciones y proporciona sus credenciales de acceso inicial.
        </p>
      </header>

      <section className="bg-surface-lowest p-12 border border-outline-variant/10 shadow-sm">
        <CreateUserForm 
          companies={[]} // No selector needed
          roles={(roles as any) || []} 
          initialCompanyId={parseInt(session.companyId, 10)} 
          isSuper={false} 
        />
      </section>
    </div>
  );
}
