import { getOrderById } from '@/lib/actions/orders';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import OrderTrackerClient from './OrderTrackerClient';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Acompanhar Pedido — Frutas Mix',
  description: 'Acompanhe o status do seu pedido em tempo real.',
};

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const { data: order, error } = await getOrderById(id);

  if (error || !order) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Title with icon */}
        <div className="flex items-center gap-3 mb-8 animate-fadeIn">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'var(--primary-light)' }}>
            📍
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Acompanhe seu pedido
            </h1>
            <p className="text-sm text-[var(--muted)]">Atualização em tempo real</p>
          </div>
        </div>
        <OrderTrackerClient initialOrder={order} />
      </main>
    </>
  );
}
