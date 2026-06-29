import { verifySession } from '@/features/auth/session';
import { redirect } from 'next/navigation';
import { CreateCompanyForm } from '@/components/company/CreateCompanyForm';
import { logout } from '@/features/auth/actions';
import Link from 'next/link';
import GlobalNavbar from '@/components/common/GlobalNavbar';

export const metadata = { title: 'LUXE ATELIER | Foundation' };

export default async function CompanyOnboardingPage() {
  const session = await verifySession();
  if (!session?.userId) redirect('/auth');

  return (
    <main className="min-h-screen bg-background flex flex-col selection:bg-secondary-container selection:text-secondary-dim">
      <GlobalNavbar 
        session={session}
        transparent={false}
        showSearch={false}
        showCart={false}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center pt-24">
         
         <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
            <CreateCompanyForm />
         </div>

         <div className="hidden md:flex flex-col w-1/2 h-[calc(100vh-6rem)] p-12 bg-surface-container-highest justify-end relative overflow-hidden">
            <img className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGitMAAA2AcZGO5xfb73_Pz1ftBGYB2Rl3GjOBojq0xoX8gRlbzt1X0sWfX7jkUPel2Zy0OvJGdPhv8rPxXdW_cxMhYsSwvoA4BCQCdmEB_XbofzQ7pF-cODsMWoPifrqz5yMtdr3_sR4CRJrj-GLpZpOvwaKBEm50nl89gUEJbCGgHzRldXjs2gSgWhU2HOC5iGicptJBVaXS9LB8QiuZrHovmv0VvMiYMdp0Z4TLkwOh8De8yZlKCkuZm3QCC3hCSf4uqOSqvhQ" alt="Hallways" />
            <div className="relative z-10 text-on-surface">
                <span className="font-headline text-3xl block mb-4 italic">"An ecosystem built for the visionary."</span>
                <span className="font-label text-[10px] uppercase tracking-[0.3em]">- The Global Directory</span>
            </div>
         </div>
      </div>
    </main>
  );
}
