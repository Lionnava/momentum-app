// src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Define una función que crea un cliente de Supabase para el NAVEGADOR.
// Se usa en Componentes de Cliente ('use client').
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}