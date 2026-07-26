import { checkStoreOpen } from '@/lib/actions/business-hours';
import { getStoreSettings } from '@/lib/actions/store-settings';
import { getNeighborhoods } from '@/lib/actions/neighborhoods';
import Header from '@/components/Header';
import CheckoutForm from '@/components/CheckoutForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout — Frutas Mix',
  description: 'Finalize seu pedido no Frutas Mix',
};

export default async function CheckoutPage() {
  const [storeStatus, settingsResult, neighborhoodsResult] = await Promise.all([
    checkStoreOpen(),
    getStoreSettings(),
    getNeighborhoods(),
  ]);

  const settings = settingsResult.data;
  const neighborhoods = neighborhoodsResult.data || [];

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Title with icon */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'var(--primary-light)' }}>
            🛒
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Finalizar Pedido
            </h1>
            <p className="text-sm text-[var(--muted)]">Revise e confirme seus itens</p>
          </div>
        </div>
        <CheckoutForm
          isStoreOpen={storeStatus.isOpen}
          defaultDeliveryFee={settings.delivery_fee ?? 0}
          whatsappNumber={settings.whatsapp_number ?? null}
          neighborhoods={neighborhoods}
          orderTrackingMode={settings.order_tracking_mode ?? 'tracking'}
        />
      </main>
    </>
  );
}
