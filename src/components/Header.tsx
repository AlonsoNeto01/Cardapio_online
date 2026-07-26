'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useStore } from '@/contexts/StoreContext';
import { getSupabaseImageUrl } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';
import Cart from './Cart';

export default function Header() {
  const { itemCount } = useCart();
  const { storeName, logoUrl } = useStore();
  const [cartOpen, setCartOpen] = useState(false);

  const resolvedLogoUrl = logoUrl ? getSupabaseImageUrl(logoUrl) : null;

  return (
    <>
      <header className="sticky top-0 z-40 glass-card-light border-b border-border/50">
        {/* Gradient accent line at top */}
        <div
          className="h-[2px] w-full"
          style={{ background: 'var(--gradient-accent)' }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group" id="logo-link">
              {resolvedLogoUrl ? (
                <div className="relative">
                  <Image
                    src={resolvedLogoUrl}
                    alt={storeName}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105" style={{ background: 'var(--gradient-cta)' }}>
                  <span className="text-white text-lg font-bold">🍉</span>
                </div>
              )}
              <span className="text-xl font-bold gradient-text">
                {storeName}
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--primary-light)] border border-border/50 transition-all duration-200 group/cart"
                aria-label="Abrir carrinho"
                id="cart-button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] group-hover/cart:text-[var(--primary)] transition-colors duration-200">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-badge-bounce" style={{ background: 'var(--gradient-cta)' }}>
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
