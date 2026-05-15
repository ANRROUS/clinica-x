'use client';

import { useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import type { UsuarioDTO } from '@/lib/api/types';
import { updateMe } from '@/lib/api/auth.api';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfileHeader() {
  const { user, updateUser } = useAuthStore();
  const [editing, setEditing] = useState<'email' | 'telefono' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const initials = `${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`;
  const fullName = `${user.nombre} ${user.apellido}`;

  const startEdit = (field: 'email' | 'telefono') => {
    setEditing(field);
    setEditValue((user as any)[field] || '');
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const data: any = {};
      data[editing] = editValue;
      const res = await updateMe(data);
      if (res.success && res.data) {
        updateUser(res.data);
        toast.success('Información actualizada');
        setEditing(null);
      } else {
        toast.error(res.error?.mensaje || 'Error al actualizar');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-center">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white">
        {initials}
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-block rounded-full bg-accent-500 px-3 py-0.5 text-xs font-semibold text-white">
            DNI: {user.dni}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Correo:</span>
            {editing === 'email' ? (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <button onClick={saveEdit} disabled={saving} className="text-brand-600 hover:text-brand-700">
                  <Save className="h-4 w-4" />
                </button>
                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <span>{user.email}</span>
            )}
            {editing !== 'email' && (
              <button onClick={() => startEdit('email')} className="text-gray-400 hover:text-brand-600">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Teléfono:</span>
            {editing === 'telefono' ? (
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <button onClick={saveEdit} disabled={saving} className="text-brand-600 hover:text-brand-700">
                  <Save className="h-4 w-4" />
                </button>
                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <span>{user.telefono || 'No especificado'}</span>
            )}
            {editing !== 'telefono' && (
              <button onClick={() => startEdit('telefono')} className="text-gray-400 hover:text-brand-600">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}