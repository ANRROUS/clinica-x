'use client';

import { useState, useEffect } from 'react';
import { Send, Bot, User, RefreshCw } from 'lucide-react';
import { useDoctorAuthStore } from '@/store/useDoctorAuthStore';
import { parseApiDate, formatLima } from '@clinica-x/date-utils';
import type { ConsultaMedicoDTO } from '@/lib/api/types';

interface AIChatProps {
  patientId: string;
  patientName: string;
  lastConsultation: ConsultaMedicoDTO | null;
  onSelectDateFilter: (dateStr: string, consultationId: string) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat({
  patientId,
  patientName,
  lastConsultation,
  onSelectDateFilter,
}: AIChatProps) {
  const { user } = useDoctorAuthStore();
  const doctorLastName = user?.apellido || 'Médico';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lastConsultation) {
      const dateStr = formatLima(parseApiDate(lastConsultation.fechaInicio), 'dd/MM/yyyy');
      setMessages([
        {
          role: 'assistant',
          content: `Hola Dr. ${doctorLastName}, la última consulta realizada por el paciente ${patientName} fue el día ${dateStr}`,
        },
      ]);
    } else {
      setMessages([
        {
          role: 'assistant',
          content: `Buenos días, Doctor/a. El paciente ${patientName} no tiene consultas anteriores registradas. ¿En qué puedo ayudarle a revisar hoy?`,
        },
      ]);
    }
  }, [patientId, patientName, lastConsultation, doctorLastName]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

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
    if (lastConsultation) {
      const dateStr = formatLima(parseApiDate(lastConsultation.fechaInicio), 'dd/MM/yyyy');
      setMessages([
        {
          role: 'assistant',
          content: `Hola Dr. ${doctorLastName}, la última consulta realizada por el paciente ${patientName} fue el día ${dateStr}`,
        },
      ]);
    } else {
      setMessages([
        {
          role: 'assistant',
          content: `Buenos días, Doctor/a. El paciente ${patientName} no tiene consultas anteriores registradas. ¿En qué puedo ayudarle a revisar hoy?`,
        },
      ]);
    }
    setInput('');
  };

  const renderMessageContent = (msg: ChatMessage, index: number) => {
    if (index === 0 && lastConsultation) {
      const fecha = parseApiDate(lastConsultation.fechaInicio);
      const dateStrDisplay = formatLima(fecha, 'dd/MM/yyyy');
      const dateStrRaw = formatLima(fecha, 'yyyy-MM-dd');
      return (
        <span className="inline-block">
          Hola Dr. {doctorLastName}, la última consulta realizada por el paciente {patientName} fue el día{' '}
          <button
            onClick={() => onSelectDateFilter(dateStrRaw, lastConsultation.id)}
            className="inline-flex items-center font-semibold text-brand-600 underline hover:text-brand-800 transition-colors mx-1"
          >
            {dateStrDisplay}
          </button>
        </span>
      );
    }
    return <span>{msg.content}</span>;
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
              style={msg.role === 'assistant' ? { backgroundColor: '#f0f9f9' } : undefined}
            >
              {msg.role === 'assistant' && (
                <Bot className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              )}
              {renderMessageContent(msg, i)}
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
