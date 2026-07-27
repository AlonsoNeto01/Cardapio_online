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
  searchQuery?: string;
}

export default function HomeClient({
  categories,
  products,
  isHighlightSection,
  searchQuery = '',
}: HomeClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
      {!searchQuery.trim() &&
        categories.map((category) => {
          const categoryProducts = filteredProducts.filter(
            (p) =>
              p.category_id === category.id ||
              (category.id === 'uncategorized' && !p.category_id)
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
