'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { getSupabaseImageUrl } from '@/lib/utils';
import type { Product, AddonItem } from '@/lib/types';

interface RepeatLastOrderBannerProps {
  products: Product[];
}

interface SavedCartItem {
  product: { id: string; image_url?: string | null; name?: string };
  quantity: number;
  observation: string;
  addons?: Array<{ id: string; name: string; price: number; addon_group_id: string }>;
}

export default function RepeatLastOrderBanner({ products }: RepeatLastOrderBannerProps) {
  const { addItem } = useCart();
  const [lastOrder, setLastOrder] = useState<SavedCartItem[] | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('frutasmix-last-order');
      if (!raw) return;
      const parsed = JSON.parse(raw) as SavedCartItem[];
      if (!Array.isArray(parsed) || parsed.length === 0) return;
      setLastOrder(parsed);
    } catch {
      // JSON malformado — não renderizar nada
    }
  }, []);

  if (!lastOrder) return null;

  // Verificar quais itens ainda são válidos (produto ativo na lista atual)
  const validItems = lastOrder
    .map((savedItem) => {
      const currentProduct = products.find(
        (p) => p.id === savedItem.product?.id && p.is_active
      );
      if (!currentProduct) return null;

      // Revalidar addons contra o produto atual
      const revalidatedAddons: AddonItem[] = (savedItem.addons || []).map((a) => ({
        id: a.id,
        addon_group_id: a.addon_group_id || '',
        name: a.name,
        price: Number(a.price),
        is_active: true,
        sort_order: 0,
        created_at: '',
      }));

      return {
        product: currentProduct,
        quantity: savedItem.quantity || 1,
        observation: savedItem.observation || '',
        addons: revalidatedAddons,
      };
    })
    .filter(Boolean) as Array<{
      product: Product;
      quantity: number;
      observation: string;
      addons: AddonItem[];
    }>;

  if (validItems.length === 0) return null;

  const unavailableCount = lastOrder.length - validItems.length;

  // Fotos dos produtos (até 5 visíveis, restante como "+N")
  const maxThumbnails = 5;
  const visibleItems = validItems.slice(0, maxThumbnails);
  const extraCount = validItems.length - maxThumbnails;

  const handleRepeat = () => {
    if (isAdding) return;
    setIsAdding(true);
    setWarningMessage(null);

    for (const item of validItems) {
      addItem(item.product, item.quantity, item.observation, item.addons);
    }

    if (unavailableCount > 0) {
      setWarningMessage(
        unavailableCount === 1
          ? '1 item do seu último pedido não está mais disponível.'
          : `${unavailableCount} itens do seu último pedido não estão mais disponíveis.`
      );
    }

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('frutasmix:open-cart'));
      setIsAdding(false);
    }, 100);
  };

  return (
    <div className="animate-fadeIn">
      <button
        onClick={handleRepeat}
        disabled={isAdding}
        className="group w-full rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)]/40 hover:bg-[var(--primary-light)] transition-all duration-300 cursor-pointer overflow-hidden"
        id="repeat-last-order-btn"
      >
        {/* Top row: icon + text + arrow */}
        <div className="flex items-center gap-4 px-5 pt-4 pb-3">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[20deg]"
            style={{ background: 'var(--gradient-cta)' }}
          >
            🔁
          </div>
          <div className="flex-1 text-left">
            <span className="block text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-200">
              Repetir último pedido
            </span>
            <span className="block text-xs text-[var(--muted)] mt-0.5">
              {validItems.length} {validItems.length === 1 ? 'item' : 'itens'} · Toque para adicionar ao carrinho
            </span>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 text-[var(--muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all duration-200"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        {/* Product thumbnails row */}
        <div className="px-5 pb-4 flex items-center gap-3">
          {/* Stacked product images */}
          <div className="flex items-center -space-x-2.5">
            {visibleItems.map((item, i) => {
              const imageUrl = getSupabaseImageUrl(item.product.image_url);
              return (
                <div
                  key={item.product.id + '-' + i}
                  className="relative w-10 h-10 rounded-full border-2 border-[var(--surface)] overflow-hidden bg-[var(--surface-elevated)] shadow-sm transition-transform duration-200 group-hover:scale-105"
                  style={{ zIndex: maxThumbnails - i }}
                  title={item.product.name}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm" style={{ background: 'var(--primary-light)' }}>
                      🍉
                    </div>
                  )}
                </div>
              );
            })}
            {extraCount > 0 && (
              <div
                className="relative w-10 h-10 rounded-full border-2 border-[var(--surface)] bg-[var(--surface-elevated)] shadow-sm flex items-center justify-center"
                style={{ zIndex: 0 }}
              >
                <span className="text-[10px] font-bold text-[var(--muted)]">
                  +{extraCount}
                </span>
              </div>
            )}
          </div>

          {/* Product names summary */}
          <p className="flex-1 text-left text-[11px] text-[var(--muted)] leading-snug line-clamp-2">
            {validItems.map((item) => item.product.name).join(', ')}
          </p>
        </div>
      </button>

      {/* Warning message */}
      {warningMessage && (
        <div className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-yellow-light)] border border-[var(--accent-yellow)]/20 animate-fadeIn">
          <span className="text-sm">⚠️</span>
          <span className="text-xs font-medium text-[var(--accent-yellow)]">
            {warningMessage}
          </span>
        </div>
      )}
    </div>
  );
}

