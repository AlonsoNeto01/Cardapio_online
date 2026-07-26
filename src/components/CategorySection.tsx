'use client';

import type { Product } from '@/lib/types';
import type { Category } from '@/lib/types';
import ProductCard from './ProductCard';

interface CategorySectionProps {
  category: Category;
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function CategorySection({ category, products, onProductClick }: CategorySectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mb-12 scroll-mt-24" id={`category-${category.id}`}>
      {/* Category header with accent decoration */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 rounded-full" style={{ background: 'var(--gradient-cta)' }} />
        <h2 className="text-lg md:text-xl font-bold text-[var(--foreground)] uppercase tracking-wide">
          {category.name}
        </h2>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-stagger-fade"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <ProductCard
              product={product}
              onClick={() => onProductClick(product)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
