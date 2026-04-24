import { verifySession } from "@/features/auth/session";
import { getServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import UsersTable from "@/components/users/UsersTable";

export const metadata = {
  title: "Equipo de Boutique | LUXE ATELIER",
};

export default async function CompanyUsersPage() {
  const session = await verifySession();

  if (!session || !session.companyId) {
    redirect("/auth");
  }

  const adminSupabase = getServiceSupabase();

  // Fetch users belonging to this boutique
  const { data: users, error } = await adminSupabase
    .from("User")
    .select(`
      id,
      email,
      fullName,
      isSuper,
      isActive,
      createdAt,
      UserRole (
        Role (
          name
        )
      )
    `)
    .eq("companyId", session.companyId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Company Users Fetch Error:", error);
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/20 pb-10">
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-secondary">
             <span className="material-symbols-outlined text-sm">badge</span>
             <span className="font-label text-[10px] uppercase tracking-[0.4em]">Gestión de Equipo</span>
           </div>
           <h1 className="font-headline text-5xl lg:text-6xl tracking-tighter text-on-surface">Colaboradores Boutique</h1>
           <p className="text-on-surface-variant font-body text-lg max-w-xl">
             Administra el personal de tu boutique. Controla accesos y roles de tu equipo local.
           </p>
        </div>
        
        <Link 
          href="/dashboard/usuarios/nuevo" 
          className="bg-on-surface text-surface px-8 py-4 text-[10px] tracking-widest uppercase font-label font-bold hover:bg-secondary transition-all shadow-lg hover:shadow-secondary/20 flex items-center space-x-3"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          <span>Invitar Usuario</span>
        </Link>
      </header>

      <section>
        <UsersTable users={(users as any) || []} showCompany={false} />
      </section>
    </div>
  );
}
