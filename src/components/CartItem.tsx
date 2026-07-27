'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency, getSupabaseImageUrl } from '@/lib/utils';
import type { CartItem } from '@/lib/types';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const shouldReduceMotion = useReducedMotion();

  if (!item) return null;

  const imageUrl = getSupabaseImageUrl(item.product.image_url);
  const unitPriceWithAddons = Number(item.product.price) + (item.addons?.reduce((s, a) => s + Number(a.price), 0) || 0);
  const itemTotalPrice = unitPriceWithAddons * item.quantity;

  return (
    <motion.div
      layout={!shouldReduceMotion}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -10 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto', y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, overflow: 'hidden' }}
      transition={
        shouldReduceMotion
          ? { duration: 0.15 }
          : { type: 'spring', stiffness: 400, damping: 30 }
      }
      className="py-3.5 border-b border-[var(--border)] last:border-0"
    >
      <div className="flex gap-3 items-center">
        {/* Product Thumbnail */}
        <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-[var(--skeleton-base)] border border-[var(--border)]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl bg-[var(--primary-light)]">
              🍉
            </div>
          )}
        </div>

        {/* Product Info */}
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
            <div className="text-xs text-[var(--muted)] mt-0.5 truncate">
              {item.addons.map(a => (
                <span key={a.id} className="inline-block mr-1.5 font-medium text-[var(--primary)]">
                  +{a.name}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[var(--muted)]">
              {formatCurrency(unitPriceWithAddons)} un.
            </span>
            <span className="text-sm font-bold text-[var(--primary)]">
              {formatCurrency(itemTotalPrice)}
            </span>
          </div>
        </div>

        {/* Stepper controls */}
        <div className="flex items-center gap-1.5 shrink-0 bg-[var(--surface-elevated)] p-1 rounded-full border border-[var(--border)]">
          <motion.button
            whileTap={shouldReduceMotion ? { opacity: 0.6 } : { scale: 0.85 }}
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-6 h-6 rounded-full bg-[var(--surface)] flex items-center justify-center text-xs font-bold text-[var(--foreground)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors"
            aria-label="Diminuir quantidade"
          >
            −
          </motion.button>
          <span className="w-5 text-center text-xs font-bold text-[var(--foreground)]">
            {item.quantity}
          </span>
          <motion.button
            whileTap={shouldReduceMotion ? { opacity: 0.6 } : { scale: 0.85 }}
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-6 h-6 rounded-full bg-[var(--surface)] flex items-center justify-center text-xs font-bold text-[var(--foreground)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors"
            aria-label="Aumentar quantidade"
          >
            +
          </motion.button>
        </div>

        {/* Delete Button */}
        <motion.button
          whileTap={shouldReduceMotion ? { opacity: 0.6 } : { scale: 0.85 }}
          onClick={() => removeItem(item.id)}
          className="p-1.5 text-[var(--muted)] hover:bg-[var(--accent-red-light)] hover:text-[var(--accent-red)] rounded-lg transition-colors shrink-0"
          aria-label="Remover item"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
