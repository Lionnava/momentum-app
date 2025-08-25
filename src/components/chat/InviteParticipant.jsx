'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // CORRECCIÓN: Importar desde '/client'

export default function InviteParticipant({ roomId }) {
  const [email, setEmail] = useState('');
  
  // CORRECCIÓN: Llamar a la función para crear la instancia.
  const supabase = createClient();

  const handleInvite = async () => {
    if (!email || !roomId) return;
    // Lógica para invitar al usuario...
    alert(`Invitando a ${email} a la sala ${roomId}`);
  };

  return (
    <div>
      {/* ... tu JSX para el formulario de invitación ... */}
    </div>
  );
}