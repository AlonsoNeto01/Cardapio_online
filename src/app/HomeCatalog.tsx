'use client';

import { useState, useMemo } from 'react';
import type { Category, Product } from '@/lib/types';
import HomeClient from './HomeClient';

interface HomeCatalogProps {
  categories: Category[];
  products: Product[];
}

export default function HomeCatalog({ categories, products }: HomeCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const uncategorizedProducts = useMemo(
    () => products.filter((p) => !p.category_id),
    [products]
  );

  const allCategories = useMemo(() => {
    if (uncategorizedProducts.length > 0) {
      return [
        ...categories,
        { id: 'uncategorized', name: '📦 Outros', sort_order: 999, created_at: '' },
      ];
    }
    return categories;
  }, [categories, uncategorizedProducts.length]);

  return (
    <>
      {/* Sticky Search & Category Bar */}
      {allCategories.length > 0 && (
        <div className="sticky top-[68px] sm:top-[68px] z-30 bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border)] py-3 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* Search input */}
          <div className="relative mb-3">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar frutas, sucos, copos..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)] transition-all duration-200"
              id="search-products"
              aria-label="Buscar produtos"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                aria-label="Limpar busca"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {allCategories.map((c) => (
              <a
                key={c.id}
                href={`#category-${c.id}`}
                className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-all duration-200"
              >
                {c.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main Catalog */}
      <HomeClient
        categories={allCategories}
        products={products}
        searchQuery={searchQuery}
      />
    </>
  );
}
