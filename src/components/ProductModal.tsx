'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Product, AddonGroup, AddonItem } from '@/lib/types';
import { formatCurrency, getSupabaseImageUrl } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { getAddonGroupsByProduct } from '@/lib/actions/addons';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Image from 'next/image';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');
  const [addonGroups, setAddonGroups] = useState<AddonGroup[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, AddonItem[]>>({});
  const [loadingAddons, setLoadingAddons] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setObservation('');
      setSelectedAddons({});
      fetchAddons();
    }
  }, [product]);

  const fetchAddons = async () => {
    if (!product) return;
    setLoadingAddons(true);
    const { data } = await getAddonGroupsByProduct(product.id);
    if (data) setAddonGroups(data);
    setLoadingAddons(false);
  };

  const handleAddonSelect = (group: AddonGroup, item: AddonItem) => {
    setSelectedAddons(prev => {
      const groupSelected = prev[group.id] || [];
      const isSelected = groupSelected.some(a => a.id === item.id);
      
      if (isSelected) {
        // Remover
        return { ...prev, [group.id]: groupSelected.filter(a => a.id !== item.id) };
      } else {
        // Adicionar
        if (group.max_choices === 1) {
          return { ...prev, [group.id]: [item] }; // Substitui
        } else if (groupSelected.length < group.max_choices) {
          return { ...prev, [group.id]: [...groupSelected, item] };
        }
      }
      return prev; // Atingiu limite
    });
  };

  const totalAddonsPrice = useMemo(() => {
    let sum = 0;
    Object.values(selectedAddons).forEach(items => {
      items.forEach(item => { sum += Number(item.price); });
    });
    return sum;
  }, [selectedAddons]);

  const canAdd = useMemo(() => {
    return addonGroups.every(group => {
      if (!group.is_mandatory) return true;
      const selected = selectedAddons[group.id] || [];
      return selected.length > 0;
    });
  }, [addonGroups, selectedAddons]);

  if (!product) return null;

  const imageUrl = getSupabaseImageUrl(product.image_url);

  const handleAdd = () => {
    if (!canAdd) return;
    
    // Flat array of all selected addons
    const allSelectedAddons = Object.values(selectedAddons).flat();
    
    addItem(product, quantity, observation, allSelectedAddons);
    onClose();
  };

  return (
    <Modal isOpen={!!product} onClose={onClose} size="md">
      {/* Image with overlay gradient */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[var(--skeleton-base)] -mt-1 mb-5">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 512px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-30 bg-[var(--primary-light)]">
            🍉
          </div>
        )}
        {/* Bottom gradient for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.is_highlight && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full text-white shadow-lg" style={{ background: 'var(--gradient-cta)' }}>
              ⭐ Destaque
            </span>
          )}
          {product.has_free_shipping && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-black/60 text-green-700 dark:text-green-400 shadow-lg backdrop-blur-sm">
              🚚 Frete Grátis
            </span>
          )}
        </div>
        {/* Price over image */}
        <div className="absolute bottom-3 right-3">
          <span className="text-2xl font-bold text-white drop-shadow-lg">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>

      {/* Info */}
      <h2 className="text-2xl font-bold text-[var(--foreground)]">
        {product.name}
      </h2>
      {product.description && (
        <p className="mt-2 text-[var(--muted)] leading-relaxed">
          {product.description}
        </p>
      )}

      {/* Addons skeleton loading */}
      {loadingAddons && (
        <div className="mt-6 space-y-4">
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-32 w-full rounded-xl" />
        </div>
      )}

      {/* Addons */}
      {!loadingAddons && addonGroups.length > 0 && (
        <div className="mt-6 space-y-5">
          {addonGroups.map((group) => {
            const selected = selectedAddons[group.id] || [];
            const isFulfilled = !group.is_mandatory || selected.length > 0;
            
            return (
              <div key={group.id} className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-elevated)]">
                {/* Group header */}
                <div className="px-4 py-3 flex justify-between items-center border-b border-[var(--border)]" style={{ background: 'var(--glass-bg)' }}>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)] text-sm">{group.name}</h4>
                    <p className="text-xs text-[var(--muted)]">
                      {group.max_choices === 1 ? 'Escolha 1 opção' : `Escolha até ${group.max_choices} opções`}
                    </p>
                  </div>
                  {group.is_mandatory && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${isFulfilled ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
                      {isFulfilled ? '✓ OK' : 'Obrigatório'}
                    </span>
                  )}
                </div>
                {/* Items */}
                <div className="p-2 space-y-1">
                  {group.items?.map(item => {
                    const isChecked = selected.some(a => a.id === item.id);
                    const disabled = !isChecked && selected.length >= group.max_choices;
                    
                    return (
                      <label 
                        key={item.id} 
                        className={`flex justify-between items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          isChecked 
                            ? 'border-[var(--primary)] bg-[var(--primary-light)]' 
                            : 'border-transparent hover:bg-[var(--surface-elevated)]'
                        } ${disabled && !isChecked ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type={group.max_choices === 1 ? "radio" : "checkbox"}
                            name={`group-${group.id}`}
                            checked={isChecked}
                            disabled={disabled && !isChecked}
                            onChange={() => handleAddonSelect(group, item)}
                            className="w-5 h-5 text-green-500 border-gray-300 focus:ring-green-500 accent-[var(--primary)]"
                          />
                          <span className="font-medium text-sm text-[var(--foreground)]">{item.name}</span>
                        </div>
                        {Number(item.price) > 0 && (
                          <span className="text-sm font-semibold text-[var(--primary)]">
                            + {formatCurrency(item.price)}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Observation */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          Observações <span className="text-[var(--muted)] font-normal">(opcional)</span>
        </label>
        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="Ex: Bem gelado, sem sal..."
          className="w-full h-20 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)] resize-none transition-all duration-200"
          id="product-observation"
        />
      </div>

      {/* Quantity + Add */}
      <div className="mt-5 flex items-center gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface-elevated)]">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-11 h-11 flex items-center justify-center text-[var(--muted)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors text-lg font-bold"
            aria-label="Diminuir quantidade"
          >
            −
          </button>
          <span className="w-11 h-11 flex items-center justify-center text-sm font-bold text-[var(--foreground)] border-x border-[var(--border)]">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-11 h-11 flex items-center justify-center text-[var(--muted)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors text-lg font-bold"
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>

        {/* Add Button */}
        <Button onClick={handleAdd} disabled={!canAdd} className="flex-1" size="lg" id="add-to-cart-btn">
          Adicionar · {formatCurrency((Number(product.price) + totalAddonsPrice) * quantity)}
        </Button>
      </div>
    </Modal>
  );
}
