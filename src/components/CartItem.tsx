'use client';

import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';

interface CartItemRowProps {
  index: number;
}

export default function CartItemRow({ index }: CartItemRowProps) {
  const { items, updateQuantity, removeItem } = useCart();
  const item = items[index];

  if (!item) return null;

  return (
    <div className="flex gap-3 py-3.5 border-b border-[var(--border)] last:border-0 animate-fadeIn">
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-[var(--foreground)] truncate">
          {item.product.name}
        </h4>
        {item.observation && (
          <p className="text-xs text-[var(--muted)] mt-0.5 truncate">
            📝 {item.observation}
          </p>
        )}
        {item.addons && item.addons.length > 0 && (
          <div className="text-xs text-[var(--muted)] mt-0.5">
            {item.addons.map(a => (
              <span key={a.id} className="inline-block mr-1">+{a.name}</span>
            ))}
          </div>
        )}
        <p className="text-sm font-bold text-[var(--primary)] mt-1">
          {formatCurrency((Number(item.product.price) + (item.addons?.reduce((s, a) => s + Number(a.price), 0) || 0)) * item.quantity)}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => updateQuantity(index, item.quantity - 1)}
          className="w-7 h-7 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center text-xs font-bold hover:bg-[var(--primary-light)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-all duration-200"
          aria-label="Diminuir quantidade"
        >
          −
        </button>
        <span className="w-7 text-center text-sm font-bold text-[var(--foreground)]">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(index, item.quantity + 1)}
          className="w-7 h-7 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center text-xs font-bold hover:bg-[var(--primary-light)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-all duration-200"
          aria-label="Aumentar quantidade"
        >
          +
        </button>
        <button
          onClick={() => removeItem(index)}
          className="ml-1 w-7 h-7 rounded-full text-[var(--muted)] hover:bg-[var(--accent-red-light)] hover:text-[var(--accent-red)] flex items-center justify-center transition-all duration-200"
          aria-label="Remover item"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
