'use client';

import { useState } from 'react';
import { Send, Bot, User, RefreshCw } from 'lucide-react';

interface AIChatProps {
  patientId: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE =
  'Buenos días, Doctor/a. Está consultando el perfil del paciente. ¿En qué puedo ayudarle a revisar hoy?';

export default function AIChat({ patientId }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Placeholder: the AI chat endpoint is pending backend implementation
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'El Agente X está en implementación. Pronto podrás consultar el expediente de este paciente mediante lenguaje natural.',
        },
      ]);
      setLoading(false);
    }, 1500);
  };

  const handleNewChat = () => {
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
    setInput('');
  };

  return (
    <div className="flex h-[500px] flex-col rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100">
            <Bot className="h-5 w-5 text-brand-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Agente X</h3>
            <p className="text-xs text-gray-500">
              Consulta a nuestro agente información que desees conocer del paciente actual
            </p>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Nuevo chat
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[80%] gap-2 rounded-lg px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-gray-200 text-gray-900'
                  : 'bg-brand-50 text-gray-900'
              }`}
            >
              {msg.role === 'assistant' && (
                <Bot className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              )}
              <span>{msg.content}</span>
              {msg.role === 'user' && (
                <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-brand-50 px-4 py-2.5">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" style={{ animationDelay: '200ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" style={{ animationDelay: '400ms' }} />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta: Ej. Quiero el historial de análisis de mi paciente"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="rounded-lg bg-brand-500 p-2.5 text-white hover:bg-brand-600 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
