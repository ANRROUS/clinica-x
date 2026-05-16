'use client';

import { useState, useCallback } from 'react';
import { sendAIChatMessage, getAIChatHistory } from '@/lib/api/doctor.api';

interface ChatMessage {
  id: string;
  role: string;
  content: string;
}

export function useAIChat(patientId: string, consultationId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(
    async (message: string) => {
      setLoading(true);
      try {
        const res = await sendAIChatMessage({
          consultationId,
          patientId,
          message,
        });
        if (res.success && res.data) {
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: 'assistant', content: res.data!.reply },
          ]);
        }
      } catch {
        // el chat sigue funcionando aunque falle el endpoint
      } finally {
        setLoading(false);
      }
    },
    [consultationId, patientId]
  );

  const loadHistory = useCallback(async () => {
    if (!consultationId) return;
    try {
      const res = await getAIChatHistory(consultationId);
      if (res.success && res.data) {
        setMessages(res.data.messages.map((m) => ({ ...m, id: m.id })));
      }
    } catch {
      // silencioso
    }
  }, [consultationId]);

  return {
    messages,
    loading,
    sendMessage,
    loadHistory,
  };
}
