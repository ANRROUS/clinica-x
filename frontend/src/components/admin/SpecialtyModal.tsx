'use client';

import { useState } from 'react';
import { X, Plus, Pencil, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminSpecialties,
  createSpecialty,
  updateSpecialty,
  toggleSpecialtyStatus,
} from '@/lib/api/admin.api';
import type { EspecialidadDTO } from '@/lib/api/types';

interface SpecialtyModalProps {
  open: boolean;
  onClose: () => void;
}

type Mode = 'list' | 'create' | 'edit';

export default function SpecialtyModal({ open, onClose }: SpecialtyModalProps) {
  const [mode, setMode] = useState<Mode>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-specialties'],
    queryFn: getAdminSpecialties,
    enabled: open,
  });

  const specialties: EspecialidadDTO[] = data?.data || [];

  const createMutation = useMutation({
    mutationFn: (name: string) => createSpecialty(name),
    onSuccess: () => {
      toast.success('Especialidad creada');
      queryClient.invalidateQueries({ queryKey: ['admin-specialties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setMode('list');
      setNombre('');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.mensaje || 'Error al crear especialidad');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, nombre: n }: { id: string; nombre: string }) => updateSpecialty(id, { nombre: n }),
    onSuccess: () => {
      toast.success('Especialidad actualizada');
      queryClient.invalidateQueries({ queryKey: ['admin-specialties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setMode('list');
      setEditingId(null);
      setNombre('');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.mensaje || 'Error al actualizar especialidad');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) => toggleSpecialtyStatus(id, activo),
    onSuccess: () => {
      toast.success('Estado actualizado');
      queryClient.invalidateQueries({ queryKey: ['admin-specialties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.mensaje || 'Error al cambiar estado');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (mode === 'create') {
      createMutation.mutate(nombre.trim());
    } else if (mode === 'edit' && editingId) {
      updateMutation.mutate({ id: editingId, nombre: nombre.trim() });
    }
  };

  const startEdit = (s: EspecialidadDTO) => {
    setMode('edit');
    setEditingId(s.id);
    setNombre(s.nombre);
  };

  const startCreate = () => {
    setMode('create');
    setEditingId(null);
    setNombre('');
  };

  const cancelEdit = () => {
    setMode('list');
    setEditingId(null);
    setNombre('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-lg rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Gestionar Especialidades</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {mode === 'list' && (
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">{specialties.length} especialidades</p>
              <button
                onClick={startCreate}
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                Agregar
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : specialties.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">No hay especialidades</p>
            ) : (
              <ul className="max-h-80 space-y-2 overflow-y-auto">
                {specialties.map((s) => (
                  <li
                    key={s.id}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                      s.activo ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${s.activo ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                        {s.nombre}
                      </span>
                      {!s.activo && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                          Inactiva
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(s)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleMutation.mutate({ id: s.id, activo: !s.activo })}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        title={s.activo ? 'Desactivar' : 'Activar'}
                        disabled={toggleMutation.isPending}
                      >
                        {s.activo ? (
                          <ToggleRight className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {(mode === 'create' || mode === 'edit') && (
          <form onSubmit={handleSubmit} className="p-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {mode === 'create' ? 'Nueva especialidad' : 'Editar especialidad'}
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Cardiología"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!nombre.trim() || createMutation.isPending || updateMutation.isPending}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {(createMutation.isPending || updateMutation.isPending) ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}