import { createBrowserClient } from '@supabase/ssr';

/**
 * Crea un cliente de Supabase para ser usado en Componentes de Cliente ('use client').
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}