import { createClient } from '@supabase/supabase-js';

/**
 * Crea un cliente de Supabase con privilegios de 'service_role'.
 * IMPORTANTE: Este cliente omite todas las políticas de RLS.
 * Úsalo solo en el servidor y para tareas administrativas (ej. invitar usuarios).
 * Requiere la variable de entorno SUPABASE_SERVICE_ROLE_KEY.
 */
export const createServiceRoleClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ¡Clave secreta!
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};