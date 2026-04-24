'use client';
import { useActionState } from 'react';
import { inviteUser } from '@/features/admin/actions';

export function InviteUserForm({ companyId }: { companyId: number }) {
  const [state, formAction, pending] = useActionState(inviteUser, { error: '' });

  return (
    <div className="bg-surface-container-low p-8 shadow-[0px_20px_40px_rgba(47,51,49,0.06)] border border-outline-variant/15 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>
      
      <h3 className="font-headline text-2xl text-on-surface mb-2">Recruit Member</h3>
      <p className="font-label text-xs text-on-surface-variant mb-8 tracking-wide">Add an existing user from the global registry to your team.</p>
      
      {state?.error && <p className="text-error font-label text-[10px] uppercase tracking-widest mb-6 bg-error-container/10 p-3 border border-error/20">{state.error}</p>}

      <form action={formAction} className="space-y-6 relative z-10">
        <input type="hidden" name="companyId" value={companyId} />
        
        <div>
          <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">User Email</label>
          <input name="email" type="email" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface placeholder:text-outline-variant/40 focus:border-secondary focus:ring-0 outline-none transition-colors" placeholder="colleague@atelier.com" />
        </div>

        <div>
          <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Assign Role</label>
          <select name="roleName" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface focus:border-secondary focus:ring-0 outline-none transition-colors appearance-none cursor-pointer">
            <option value="Manager">Boutique Manager</option>
            <option value="Sales">Sales Associate</option>
            <option value="Inventory">Inventory Clerk</option>
          </select>
        </div>

        <button disabled={pending} type="submit" className="w-full bg-on-surface text-surface py-4 font-label text-[10px] uppercase tracking-[0.3em] hover:bg-secondary transition-all mt-4 disabled:opacity-50">
          {pending ? 'Dispatching...' : 'Dispatch Invitation'}
        </button>
      </form>
    </div>
  );
}
