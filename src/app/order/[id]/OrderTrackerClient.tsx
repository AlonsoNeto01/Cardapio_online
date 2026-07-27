'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderById } from '@/lib/actions/orders';
import { formatCurrency } from '@/lib/utils';
import type { Order, OrderStatus } from '@/lib/types';
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@/lib/types';
import Button from '@/components/ui/Button';

interface OrderTrackerClientProps {
  initialOrder: Order;
}

const STATUS_STEPS: OrderStatus[] = ['novo', 'preparando', 'entrega', 'concluido'];

const STATUS_CONFIG: Record<OrderStatus, { icon: string; description: string }> = {
  novo: {
    icon: '📝',
    description: 'Aguardando confirmação do restaurante.',
  },
  preparando: {
    icon: '👨‍🍳',
    description: 'Seu pedido está sendo preparado com carinho.',
  },
  entrega: {
    icon: '🛵',
    description: 'O entregador já está a caminho!',
  },
  concluido: {
    icon: '✅',
    description: 'Pedido entregue. Bom apetite!',
  },
};

export default function OrderTrackerClient({ initialOrder }: OrderTrackerClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>(initialOrder);

  useEffect(() => {
    // Se o pedido já inicia concluído, limpa do localStorage
    if (order.status === 'concluido') {
      localStorage.removeItem('frutasmix-active-order');
      return;
    }

    // Polling a cada 8 segundos para consultar o status atualizado do pedido
    const intervalId = setInterval(async () => {
      const result = await getOrderById(order.id);
      if (result?.data) {
        const updatedOrder = result.data as Order;
        setOrder((prev) => {
          if (prev.status !== updatedOrder.status) {
            if (updatedOrder.status === 'concluido') {
              localStorage.removeItem('frutasmix-active-order');
              window.dispatchEvent(new Event('frutasmix-order-update'));
            }
            return updatedOrder;
          }
          return prev;
        });
      }
    }, 8000);

    return () => {
      clearInterval(intervalId);
    };
  }, [order.id, order.status]);

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Order ID badge */}
      <div className="text-center">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)]">
          Pedido #{order.id.split('-')[0].toUpperCase()}
        </span>
      </div>

      {/* Progress Tracker */}
      <div className="bg-[var(--surface)] rounded-2xl p-6 md:p-8 border border-[var(--border)]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-7 left-6 right-6 md:left-10 md:right-10 h-1 bg-[var(--surface-elevated)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                background: 'var(--gradient-cta)',
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {STATUS_STEPS.map((status, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const config = STATUS_CONFIG[status];

              return (
                <div key={status} className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl z-10 transition-all duration-500 ${
                      isCompleted
                        ? 'text-white shadow-lg'
                        : 'bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)]'
                    } ${isCurrent ? 'ring-4 ring-[var(--primary)]/20 scale-110' : ''}`}
                    style={isCompleted ? { background: 'var(--gradient-cta)', boxShadow: 'var(--shadow-glow-green)' } : {}}
                  >
                    {config.icon}
                  </div>
                  <div className="mt-3 text-center max-w-[80px] md:max-w-[120px]">
                    <p
                      className={`text-xs md:text-sm font-semibold transition-colors duration-500 ${
                        isCompleted ? 'text-[var(--foreground)]' : 'text-[var(--muted)]'
                      }`}
                    >
                      {ORDER_STATUS_LABELS[status]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Status Message */}
        <div className="mt-10 text-center p-4 bg-[var(--primary-light)] rounded-xl border border-green-500/10">
          <p className="text-base font-medium text-[var(--foreground)]">
            {STATUS_CONFIG[order.status].icon} {STATUS_CONFIG[order.status].description}
          </p>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center gap-2">
          <span className="text-base">📋</span>
          <h3 className="font-bold text-[var(--foreground)]">Resumo do Pedido</h3>
        </div>
        
        <div className="p-6 space-y-3">
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm md:text-base">
              <div>
                <span className="font-medium text-[var(--foreground)]">
                  {item.quantity}x {item.product_name}
                </span>
                {item.addons && item.addons.length > 0 && (
                  <div className="text-xs text-[var(--muted)] mt-0.5 pl-2 border-l-2 border-[var(--border)]">
                    {item.addons.map(a => (
                      <div key={a.id}>+ {a.name}</div>
                    ))}
                  </div>
                )}
                {item.observation && (
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    📝 {item.observation}
                  </p>
                )}
              </div>
              <span className="font-semibold text-[var(--foreground)]">
                {formatCurrency(item.unit_price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 pt-4 border-t border-[var(--border)] space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--muted)]">Nome</span>
            <span className="font-medium text-[var(--foreground)]">{order.customer_name}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--muted)]">Endereço</span>
            <span className="font-medium text-[var(--foreground)] text-right max-w-[60%]">
              {order.address}
            </span>
          </div>
          {order.neighborhood && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--muted)]">Bairro</span>
              <span className="font-medium text-[var(--foreground)]">{order.neighborhood}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--muted)]">Pagamento</span>
            <span className="font-medium text-[var(--foreground)]">
              {PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method}
            </span>
          </div>
          {order.delivery_fee > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--muted)]">🛵 Taxa de entrega</span>
              <span className="font-medium text-[var(--foreground)]">
                {formatCurrency(order.delivery_fee)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
            <span className="font-bold text-[var(--foreground)]">Total</span>
            <span className="text-2xl font-bold text-[var(--primary)]">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="text-center pb-8">
        <Button
          onClick={() => router.push('/')}
          variant="secondary"
          size="lg"
        >
          🍉 Fazer um novo pedido
        </Button>
      </div>
    </div>
  );
}
