'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function InviteParticipant({ roomId }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.rpc('add_participant_to_room', {
      p_room_id: roomId,
      p_user_email: email,
    });

    if (error) setMessage(`Error: ${error.message}`);
    else setMessage(data);
    
    if (data && data.startsWith('Éxito')) setEmail('');
    setLoading(false);
  };

  // ... (el JSX del return se queda igual)
}