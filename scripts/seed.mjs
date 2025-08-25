// scripts/seed.mjs
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Línea clave: Le decimos a dotenv que busque el archivo .env.local en la raíz del proyecto.
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seedData() {
  console.log('🌱 Iniciando siembra de datos...');

  // --- 1. Configuración del cliente de Supabase ---
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Error: Faltan las variables de entorno de Supabase en tu archivo .env.local');
    return;
  }
  
  const supabaseAdmin = createClient(supabaseUrl, serviceKey);

  // --- 2. Tus datos personalizados para insertar ---
  const divisions = [
    { name: 'Ciencia, Tecnologías e Innovación' },
    { name: 'Planificación y Gestión' },
    { name: 'Prensa' },
    { name: 'Marketing' },
    { name: 'Finanzas' },
  ];

  // --- 3. Proceso de siembra ---
  try {
    const { data, error } = await supabaseAdmin
      .from('divisions')
      .upsert(divisions, { onConflict: 'name' }) // onConflict asegura que no se dupliquen por nombre
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ ${data.length} divisiones sembradas con éxito.`);
    
  } catch (error) {
    console.error('❌ Error durante la siembra:', error.message);
  } finally {
    console.log('🌱 Proceso de siembra finalizado.');
  }
}

// Ejecutar la función
seedData();