// src/app/api/chat/start/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Obtener las cookies de la request
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { userId: participantId } = await request.json();

    if (!participantId) {
      return NextResponse.json(
        { error: 'ID de participante requerido' },
        { status: 400 }
      );
    }

    // 1. Verificar si ya existe una sala DM entre estos usuarios
    const { data: existingRooms, error: checkError } = await supabase
      .rpc('get_direct_message_room', {
        user1_id: user.id,
        user2_id: participantId
      });

    if (checkError) {
      console.error('Error checking existing DM:', checkError);
      return NextResponse.json(
        { error: 'Error al verificar conversación existente' },
        { status: 500 }
      );
    }

    // 2. Si ya existe, retornar esa sala
    if (existingRooms && existingRooms.length > 0) {
      return NextResponse.json({ roomId: existingRooms[0].id });
    }

    // 3. Si no existe, crear nueva sala DM
    const { data: newRoom, error: createError } = await supabase
      .from('rooms')
      .insert({
        room_type: 'dm',
        name: null
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating room:', createError);
      return NextResponse.json(
        { error: 'Error al crear la conversación' },
        { status: 500 }
      );
    }

    // 4. Agregar ambos usuarios como participantes
    const { error: participantsError } = await supabase
      .from('participants')
      .insert([
        { room_id: newRoom.id, user_id: user.id },
        { room_id: newRoom.id, user_id: participantId }
      ]);

    if (participantsError) {
      console.error('Error adding participants:', participantsError);
      
      // Limpiar la room creada si falla la inserción de participantes
      await supabase.from('rooms').delete().eq('id', newRoom.id);
      
      return NextResponse.json(
        { error: 'Error al agregar participantes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ roomId: newRoom.id });

  } catch (error) {
    console.error('Unexpected error in start chat API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}