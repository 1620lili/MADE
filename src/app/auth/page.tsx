import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { verifySession } from '@/features/auth/session';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'LUXE ATELIER | Authentication',
  description: 'Join the collective or access your curated collection.',
};

export default async function AuthPage() {
  const session = await verifySession();
  
  if (session?.userId && session?.profileExists) {
     redirect('/dashboard');
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12 flex items-center justify-center px-6 lg:px-12 bg-background">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-background/40 z-10 backdrop-blur-sm"></div>
        <img 
          className="w-full h-full object-cover grayscale-[20%] opacity-40 scale-105" 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop" 
          alt="Luxury Mall Architecture" 
        />
      </div>
      
      <div className="relative z-20 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest shadow-[0px_20px_40px_rgba(47,51,49,0.06)] overflow-hidden">
        <LoginForm />
        <RegisterForm />
      </div>
    </div>
  );
}
