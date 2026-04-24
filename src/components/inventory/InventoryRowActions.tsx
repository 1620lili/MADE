'use client';

import { useTransition } from 'react';
import { deleteVariant } from '@/features/inventory/actions';

export function InventoryRowActions({ variantId, companyId }: { variantId: number, companyId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to completely erase this item from the collection?")) {
      startTransition(() => {
        deleteVariant(variantId, companyId);
      });
    }
  };

  return (
    <div className="flex justify-end gap-4">
      <button className="material-symbols-outlined text-outline hover:text-primary transition-colors text-lg" title="View Details">visibility</button>
      <button className="material-symbols-outlined text-outline hover:text-primary transition-colors text-lg" title="Edit">edit_note</button>
      <button 
        onClick={handleDelete} 
        disabled={isPending}
        className="material-symbols-outlined text-outline hover:text-error transition-colors text-lg disabled:opacity-50"
        title="Delete"
      >
        {isPending ? 'hourglass_bottom' : 'delete'}
      </button>
    </div>
  );
}
