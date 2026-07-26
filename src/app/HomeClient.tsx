'use client';

import { useState, useMemo } from 'react';
import type { Category, Product } from '@/lib/types';
import CategorySection from '@/components/CategorySection';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';

interface HomeClientProps {
  categories: Category[];
  products: Product[];
  isHighlightSection?: boolean;
}

export default function HomeClient({ categories, products, isHighlightSection }: HomeClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Client-side search filter
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  if (isHighlightSection) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-stagger-fade"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <ProductCard
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            </div>
          ))}
        </div>
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </>
    );
  }

  return (
    <>
      {/* Search bar + Category navigation */}
      {categories.length > 0 && (
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
            {categories.map(c => (
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

      {/* Search results */}
      {searchQuery.trim() && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm text-[var(--muted)]">
              {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} para &ldquo;<span className="text-[var(--foreground)] font-medium">{searchQuery}</span>&rdquo;
            </p>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">🔍</span>
              <p className="text-[var(--foreground)] font-semibold">Nenhum produto encontrado</p>
              <p className="text-sm text-[var(--muted)] mt-1">Tente buscar por outro termo</p>
            </div>
          )}
        </div>
      )}

      {/* Category sections (hidden when searching) */}
      {!searchQuery.trim() && categories.map((category) => {
        const categoryProducts = filteredProducts.filter(
          (p) => p.category_id === category.id || (category.id === 'uncategorized' && !p.category_id)
        );

        return (
          <CategorySection
            key={category.id}
            category={category}
            products={categoryProducts}
            onProductClick={(product) => setSelectedProduct(product)}
          />
        );
      })}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
