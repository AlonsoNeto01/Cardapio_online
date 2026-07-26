'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import CartItemRow from './CartItem';
import Button from './ui/Button';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { items, total, clearCart } = useCart();
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex justify-end animate-fadeIn"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-[var(--surface)] shadow-2xl flex flex-col animate-slideRight border-l border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: 'var(--primary-light)' }}>
              🛒
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                Carrinho
              </h2>
              {items.length > 0 && (
                <p className="text-xs text-[var(--muted)]">
                  {items.length} {items.length === 1 ? 'item' : 'itens'}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--surface-elevated)] transition-colors"
            aria-label="Fechar carrinho"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--primary-light)' }}>
                <span className="text-4xl">🛒</span>
              </div>
              <p className="text-[var(--foreground)] font-semibold">
                Seu carrinho está vazio
              </p>
              <p className="text-sm text-[var(--muted)] mt-1">
                Adicione frutas frescas ao seu pedido!
              </p>
              <Button onClick={onClose} variant="secondary" className="mt-6" size="sm">
                Ver Cardápio
              </Button>
            </div>
          ) : (
            <div className="py-2">
              {items.map((_, index) => (
                <CartItemRow key={index} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--border)] p-5 space-y-4 bg-[var(--surface-elevated)]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--muted)]">Subtotal</span>
              <span className="text-xl font-bold text-[var(--primary)]">
                {formatCurrency(total)}
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] flex items-center gap-1">
              🛵 Taxa de entrega calculada no checkout
            </p>
            <Button onClick={handleCheckout} className="w-full" size="lg" id="go-to-checkout-btn">
              Ir para Checkout →
            </Button>
            <button
              onClick={clearCart}
              className="w-full text-center text-sm text-[var(--accent-red)] hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
