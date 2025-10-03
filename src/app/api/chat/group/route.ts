// src/app/api/chat/group/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { participantIds, groupName } = await request.json();

    if (!participantIds || participantIds.length === 0) {
      return NextResponse.json({ error: 'Participantes requeridos' }, { status: 400 });
    }

    if (!groupName) {
      return NextResponse.json({ error: 'Nombre de grupo requerido' }, { status: 400 });
    }

    // Crear sala grupal
    const { data: newRoom, error: createError } = await supabase
      .from('rooms')
      .insert({
        room_type: 'group',
        name: groupName
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating group room:', createError);
      return NextResponse.json({ error: 'Error al crear el grupo' }, { status: 500 });
    }

    // Agregar participantes (incluyendo al usuario actual)
    const allParticipants = [...participantIds, user.id];
    const participantsData = allParticipants.map(user_id => ({
      room_id: newRoom.id,
      user_id
    }));

    const { error: participantsError } = await supabase
      .from('participants')
      .insert(participantsData);

    if (participantsError) {
      console.error('Error adding group participants:', participantsError);
      await supabase.from('rooms').delete().eq('id', newRoom.id);
      return NextResponse.json({ error: 'Error al agregar participantes' }, { status: 500 });
    }

    return NextResponse.json({ roomId: newRoom.id });

  } catch (error) {
    console.error('Unexpected error in group chat API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}