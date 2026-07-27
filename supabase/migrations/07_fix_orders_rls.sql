-- ============================================
-- Migration: Remover acesso anônimo direto a orders e order_items
-- As server actions createOrder e getOrderById agora utilizam service role.
-- O rastreamento de pedidos (/order/[id]) utiliza polling via getOrderById.
-- ============================================

DROP POLICY IF EXISTS "Anon can read orders" ON orders;
DROP POLICY IF EXISTS "Anon can insert orders" ON orders;
DROP POLICY IF EXISTS "Anon can read order_items" ON order_items;
DROP POLICY IF EXISTS "Anon can insert order_items" ON order_items;
