-- 0. Eliminar funciones existentes para evitar conflictos de tipo de retorno
DROP FUNCTION IF EXISTS public.get_user_chat_rooms(UUID);
DROP FUNCTION IF EXISTS public.create_chat_room_with_participants(UUID[], TEXT, TEXT);
DROP FUNCTION IF EXISTS public.find_dm_room(UUID[]);

-- Eliminar políticas RLS existentes para limpiar recursión infinita (ejecutar primero)
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear salas" ON public.chat_rooms;
DROP POLICY IF EXISTS "Ver salas donde participas" ON public.chat_rooms;
DROP POLICY IF EXISTS "Propietarios pueden actualizar/eliminar salas" ON public.chat_rooms;
DROP POLICY IF EXISTS "Usuarios pueden unirse a salas" ON public.chat_participants;
DROP POLICY IF EXISTS "Ver tus participaciones" ON public.chat_participants;
DROP POLICY IF EXISTS "Actualizar/eliminar tu participación" ON public.chat_participants;
DROP POLICY IF EXISTS "Usuarios pueden insertar mensajes en sus salas" ON public.messages;
DROP POLICY IF EXISTS "Ver mensajes en tus salas" ON public.messages;
DROP POLICY IF EXISTS "Autenticados insert chat_rooms" ON public.chat_rooms;
DROP POLICY IF EXISTS "Select chat_rooms participantes" ON public.chat_rooms;
DROP POLICY IF EXISTS "No update/delete chat_rooms" ON public.chat_rooms;
DROP POLICY IF EXISTS "No update chat_rooms" ON public.chat_rooms;
DROP POLICY IF EXISTS "No delete chat_rooms" ON public.chat_rooms;
DROP POLICY IF EXISTS "Insert chat_participants own" ON public.chat_participants;
DROP POLICY IF EXISTS "Select chat_participants own" ON public.chat_participants;
DROP POLICY IF EXISTS "Update chat_participants own" ON public.chat_participants;
DROP POLICY IF EXISTS "Delete chat_participants own" ON public.chat_participants;
DROP POLICY IF EXISTS "Update/delete chat_participants own" ON public.chat_participants;
DROP POLICY IF EXISTS "Insert messages in own rooms" ON public.messages;
DROP POLICY IF EXISTS "Select messages in own rooms" ON public.messages;
DROP POLICY IF EXISTS "No update messages" ON public.messages;
DROP POLICY IF EXISTS "No delete messages" ON public.messages;
DROP POLICY IF EXISTS "No update/delete messages" ON public.messages;

-- Recrear políticas después si es necesario, pero primero drops para limpiar

-- No recrear tablas, solo políticas y funciones (asumiendo tablas existentes con FK a profiles)
-- Si las tablas no existen, créalas manualmente en Table Editor con FK a profiles.id

-- 2. Habilitar RLS en todas las tablas (si no está ya)
ALTER TABLE IF EXISTS public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.messages ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS seguras y no recursivas para chat_rooms
-- INSERT: Autenticados pueden crear
CREATE POLICY "Autenticados insert chat_rooms" ON public.chat_rooms
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- SELECT: Solo salas donde eres participante
CREATE POLICY "Select chat_rooms participantes" ON public.chat_rooms
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.chat_participants WHERE chat_participants.room_id = chat_rooms.id AND chat_participants.user_id = auth.uid())
  );

-- UPDATE/DELETE: Deshabilitado por simplicidad (agrega owner si necesitas)
CREATE POLICY "No update chat_rooms" ON public.chat_rooms
  FOR UPDATE TO authenticated USING (false);

CREATE POLICY "No delete chat_rooms" ON public.chat_rooms
  FOR DELETE TO authenticated USING (false);

-- 4. Políticas para chat_participants (solo basadas en user_id, sin refs a rooms)
CREATE POLICY "Insert chat_participants own" ON public.chat_participants
  FOR INSERT TO authenticated WITH CHECK (chat_participants.user_id = auth.uid());

CREATE POLICY "Select chat_participants own" ON public.chat_participants
  FOR SELECT TO authenticated USING (chat_participants.user_id = auth.uid());

CREATE POLICY "Update chat_participants own" ON public.chat_participants
  FOR UPDATE TO authenticated USING (chat_participants.user_id = auth.uid());

CREATE POLICY "Delete chat_participants own" ON public.chat_participants
  FOR DELETE TO authenticated USING (chat_participants.user_id = auth.uid());

-- 5. Políticas para messages (verificar participación en room)
CREATE POLICY "Insert messages in own rooms" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.chat_participants WHERE chat_participants.room_id = messages.room_id AND chat_participants.user_id = auth.uid())
  );

CREATE POLICY "Select messages in own rooms" ON public.messages
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.chat_participants WHERE chat_participants.room_id = messages.room_id AND chat_participants.user_id = auth.uid())
  );

CREATE POLICY "No update messages" ON public.messages
  FOR UPDATE TO authenticated USING (false);

CREATE POLICY "No delete messages" ON public.messages
  FOR DELETE TO authenticated USING (false);

-- 6. Índices
CREATE INDEX IF NOT EXISTS idx_chat_participants_room_user ON public.chat_participants(room_id, user_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON public.chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_room ON public.messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_user ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at);

-- 7. RPC para obtener rooms del usuario (usada en layout.tsx)
CREATE OR REPLACE FUNCTION public.get_user_chat_rooms(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  room_type TEXT,
  participants JSON  -- Array de {id, full_name, avatar_url}
) AS $$
  SELECT
    cr.id,
    cr.name,
    cr.room_type,
    COALESCE(
      (SELECT json_agg(participant_json)
       FROM (
         SELECT json_build_object(
           'id', cp2.user_id,
           'full_name', pr2.full_name,
           'avatar_url', pr2.avatar_url
         ) as participant_json
         FROM public.chat_participants cp2
         LEFT JOIN public.profiles pr2 ON cp2.user_id = pr2.id
         WHERE cp2.room_id = cr.id AND cp2.user_id != p_user_id
       ) sub
      ), '[]'::json
    ) as participants
  FROM public.chat_rooms cr
  JOIN public.chat_participants cp ON cr.id = cp.room_id AND cp.user_id = p_user_id
  GROUP BY cr.id, cr.name, cr.room_type
  ORDER BY cr.created_at DESC;
$$ LANGUAGE sql SECURITY DEFINER;

-- 8. RPC para crear room con participants (mejorada)
CREATE OR REPLACE FUNCTION public.create_chat_room_with_participants(
  p_user_ids UUID[],
  p_room_name TEXT DEFAULT NULL,
  p_room_type TEXT DEFAULT 'group'
)
RETURNS UUID AS $$
DECLARE
  new_room_id UUID;
  user_id UUID;
  user_count INTEGER := array_length(p_user_ids, 1);
BEGIN
  -- Verificar auth y que caller esté en lista
  IF auth.uid() IS NULL OR NOT (auth.uid() = ANY(p_user_ids)) THEN
    RAISE EXCEPTION 'Usuario no autenticado o no en participantes';
  END IF;

  IF user_count < 2 THEN
    RAISE EXCEPTION 'Mínimo 2 participantes';
  END IF;

  -- Para DM
  IF user_count = 2 AND p_room_type = 'dm' THEN
    -- Buscar existente
    SELECT cr.id INTO new_room_id
    FROM public.chat_rooms cr
    JOIN public.chat_participants cp1 ON cr.id = cp1.room_id
    JOIN public.chat_participants cp2 ON cr.id = cp2.room_id
    WHERE cr.room_type = 'dm'
      AND ((cp1.user_id = p_user_ids[1] AND cp2.user_id = p_user_ids[2])
           OR (cp1.user_id = p_user_ids[2] AND cp2.user_id = p_user_ids[1]));

    IF new_room_id IS NOT NULL THEN
      RETURN new_room_id;
    END IF;

    -- Crear nueva DM
    INSERT INTO public.chat_rooms (room_type) VALUES ('dm') RETURNING id INTO new_room_id;
  ELSE
    -- Grupo: validar nombre
    IF p_room_name IS NULL OR trim(p_room_name) = '' THEN
      RAISE EXCEPTION 'Nombre requerido para grupos';
    END IF;
    INSERT INTO public.chat_rooms (name, room_type) VALUES (trim(p_room_name), p_room_type) RETURNING id INTO new_room_id;
  END IF;

  -- Insertar participants (SECURITY DEFINER bypass RLS)
  FOREACH user_id IN ARRAY p_user_ids LOOP
    INSERT INTO public.chat_participants (room_id, user_id) VALUES (new_room_id, user_id)
    ON CONFLICT (room_id, user_id) DO NOTHING;  -- Evita duplicados
  END LOOP;

  RETURN new_room_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. RPC para find_dm_room (de código original, si existe)
CREATE OR REPLACE FUNCTION public.find_dm_room(p_user_ids UUID[])
RETURNS UUID AS $$
  SELECT cr.id
  FROM public.chat_rooms cr
  JOIN public.chat_participants cp1 ON cr.id = cp1.room_id
  JOIN public.chat_participants cp2 ON cr.id = cp2.room_id
  WHERE cr.room_type = 'dm'
    AND ((cp1.user_id = p_user_ids[1] AND cp2.user_id = p_user_ids[2])
         OR (cp1.user_id = p_user_ids[2] AND cp2.user_id = p_user_ids[1]));
$$ LANGUAGE sql SECURITY DEFINER;

-- 10. Permisos
GRANT EXECUTE ON FUNCTION public.get_user_chat_rooms TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_chat_room_with_participants TO authenticated;
GRANT EXECUTE ON FUNCTION public.find_dm_room TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;