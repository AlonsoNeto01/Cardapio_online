'use client';

import type { Product } from '@/lib/types';
import { formatCurrency, getSupabaseImageUrl } from '@/lib/utils';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const imageUrl = getSupabaseImageUrl(product.image_url);
  const isUnavailable = product.is_available === false;

  return (
    <button
      onClick={onClick}
      className={`group flex w-full text-left bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden card-interactive hover:bg-[var(--surface-elevated)] transition-all duration-300 p-3 gap-4 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 ${
        isUnavailable ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      id={`product-card-${product.id}`}
    >
      {/* Image */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-[var(--skeleton-base)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ease-out ${
              isUnavailable ? '' : 'group-hover:scale-110'
            }`}
            sizes="(max-width: 640px) 96px, 112px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl opacity-40 bg-[var(--primary-light)]">
            🍉
          </div>
        )}
        {/* Badges over image */}
        {isUnavailable && (
          <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded-md text-white shadow-md bg-gray-600/90 backdrop-blur-sm">
            😴 Esgotado hoje
          </span>
        )}
        {!isUnavailable && product.is_highlight && (
          <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded-md text-white shadow-md" style={{ background: 'var(--gradient-cta)' }}>
            ⭐ Destaque
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-1">
        <h3 className={`font-semibold line-clamp-2 leading-tight transition-colors duration-200 ${
          isUnavailable
            ? 'text-[var(--muted)]'
            : 'text-[var(--foreground)] group-hover:text-[var(--primary)]'
        }`}>
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-[var(--muted)] line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-2.5">
          <span className={`text-base font-bold ${isUnavailable ? 'text-[var(--muted)]' : 'text-[var(--primary)]'}`}>
            {formatCurrency(product.price)}
          </span>
          {product.has_free_shipping && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-green-700 dark:text-green-400 border border-green-500/15">
              🚚 Frete Grátis
            </span>
          )}
        </div>
      </div>

      {/* Add hint icon — hidden when unavailable */}
      {!isUnavailable && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-110">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
      )}
    </button>
  );
}

