import { getCategories } from '@/lib/actions/categories';
import { getActiveProducts } from '@/lib/actions/products';
import { checkStoreOpen } from '@/lib/actions/business-hours';
import { getStoreSettings } from '@/lib/actions/store-settings';
import { getSupabaseImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Header from '@/components/Header';
import RepeatLastOrderBanner from '@/components/RepeatLastOrderBanner';
import HomeClient from './HomeClient';
import HomeCatalog from './HomeCatalog';
import type { Category, Product } from '@/lib/types';

export default async function Home() {
  const [categoriesResult, productsResult, storeStatus, settingsResult] = await Promise.all([
    getCategories(),
    getActiveProducts(),
    checkStoreOpen(),
    getStoreSettings(),
  ]);

  const categories = (categoriesResult.data || []) as Category[];
  const products = (productsResult.data || []) as Product[];
  const storeName = settingsResult.data?.store_name || 'Frutas Mix';

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden" aria-label="Banner principal">
        {/* Cover Image */}
        <div className="w-full h-56 md:h-72 lg:h-80 relative">
          <Image
            src={settingsResult.data?.cover_url ? (getSupabaseImageUrl(settingsResult.data.cover_url) ?? "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop") : "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop"}
            alt="Capa da Loja"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

          {/* CTA overlay on banner */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold mb-4 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Delivery Rápido
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg animate-fadeIn text-balance">
              Frutas frescas selecionadas
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/80 font-medium drop-shadow animate-fadeIn">
              Direto na sua porta com qualidade premium 🍍
            </p>
          </div>
        </div>

        {/* Store Info — overlapping the hero bottom */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center -mt-14 sm:-mt-16 z-10 mb-8">
          {/* Logo */}
          <div className="inline-block relative">
            <div className="p-1 rounded-full shadow-xl" style={{ background: 'var(--gradient-accent)' }}>
              <div className="bg-[var(--background)] rounded-full p-0.5">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-[var(--surface)]">
                  {settingsResult.data?.logo_url ? (
                    <img
                      src={getSupabaseImageUrl(settingsResult.data.logo_url) || ''}
                      alt={storeName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-cta)' }}>
                      <span className="text-white text-3xl sm:text-4xl font-bold">🍉</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            {storeName}
          </h1>

          {/* Store status badge */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition-colors ${storeStatus.isOpen
                ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
              }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${storeStatus.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              {storeStatus.isOpen ? 'Aberto agora' : 'Fechado'}
            </span>
            {storeStatus.message && (
              <span className="text-sm text-[var(--muted)]">
                {storeStatus.message}
              </span>
            )}
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        {/* Repetir último pedido */}
        <div className="mb-6">
          <RepeatLastOrderBanner products={products} />
        </div>

        {/* Highlights */}
        {products.some((p) => p.is_highlight) && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: 'var(--accent-yellow-light)' }}>
                ⭐
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                Destaques
              </h2>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>
            <HomeClient
              categories={[]}
              products={products.filter((p) => p.is_highlight)}
              isHighlightSection
            />
          </section>
        )}

        {/* Catálogo com Busca Única */}
        <HomeCatalog categories={categories} products={products} />

        {products.length === 0 && (
          <div className="text-center py-20 animate-fadeIn">
            <span className="text-6xl block mb-4">🍉</span>
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              Cardápio em breve! 🍍
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              Estamos selecionando as melhores frutas. Volte em breve!
            </p>
          </div>
        )}
      </main>

      {/* Footer Premium */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Brand */}
            <div className="text-center md:text-left">
              <h3 className="font-bold text-[var(--foreground)] text-lg gradient-text">
                {storeName}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Frutas frescas com delivery rápido e prático.
              </p>
            </div>

            {/* Payment badges */}
            <div className="text-center">
              <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                Formas de pagamento
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-medium text-[var(--foreground)]">
                  💠 Pix
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-medium text-[var(--foreground)]">
                  💳 Cartão
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-medium text-[var(--foreground)]">
                  💵 Dinheiro
                </span>
              </div>
            </div>

            {/* Security */}
            <div className="text-center md:text-right">
              <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                Segurança
              </p>
              <div className="flex items-center justify-center md:justify-end gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-600 dark:text-green-400">
                  🔒 Pagamento Seguro
                </span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-[var(--muted)]">
              © {new Date().getFullYear()} {storeName}
            </p>
            <a
              href="https://twodevssolutions.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--muted)] hover:text-[var(--primary)] transition-colors font-medium"
            >
              Desenvolvido por TwoDevs Solutions
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
