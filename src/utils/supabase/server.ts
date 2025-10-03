// src/utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Esta es la implementación oficial y recomendada.
// Es diferente a la que teníamos antes.
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // La librería ahora espera una función 'get' que devuelve una sola cookie.
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // La función 'set' para establecer una cookie.
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // El middleware `set` puede fallar en las Server Actions, pero es seguro ignorarlo.
          }
        },
        // La función 'remove' para eliminar una cookie.
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // El middleware `set` puede fallar en las Server Actions, pero es seguro ignorarlo.
          }
        },
      },
    }
  )
}