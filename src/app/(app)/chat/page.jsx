'use client';

import React, { useState } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <ChatSidebar onSelectRoom={setSelectedRoom} selectedRoom={selectedRoom} />
      <ChatWindow selectedRoom={selectedRoom} />
    </div>
  );
}