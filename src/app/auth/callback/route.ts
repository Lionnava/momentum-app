// src/app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Redirige al usuario a la URL 'next' (en nuestro caso, /update-password)
      // o a la página de inicio si 'next' no está definido.
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }
  }

  // Si hay un error o no hay código, redirigir a una página de error
  console.error('Error en el callback de autenticación o código no encontrado');
  return NextResponse.redirect(`${requestUrl.origin}/login?message=Error: No se pudo autenticar al usuario.`)
}