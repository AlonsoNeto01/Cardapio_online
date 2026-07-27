import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * ⚠️ ATENÇÃO: SEGURANÇA CRÍTICA ⚠️
 * Este client do Supabase utiliza a SUPABASE_SERVICE_ROLE_KEY.
 * Ele IGNORA todas as políticas de Row Level Security (RLS).
 * 
 * NUNCA importe este arquivo em componentes do lado do cliente (Client Components)
 * ou em qualquer código executado no navegador.
 * Seu uso é restrito EXCLUSIVAMENTE a Server Actions e Server Components.
 */

export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_URL não configurados.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
