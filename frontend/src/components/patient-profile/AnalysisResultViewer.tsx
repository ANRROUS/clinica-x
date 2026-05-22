'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, X, AlertCircle, FlaskConical, Beaker, Dna } from 'lucide-react';
import { getOcrResults } from '@/lib/api/medical.api';
import type { AnalisisResultadoDTO, AnalisisItemDTO } from '@/lib/api/types';

interface Props {
  archivoId: string;
  title: string;
  onClose: () => void;
}

function getStatoBadge(estado?: string) {
  if (!estado) return null;
  const isNormal = estado.toLowerCase() === 'normal';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        isNormal
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-700'
      }`}
    >
      {isNormal ? 'Normal' : 'Anormal'}
    </span>
  );
}

function getTipoIcon(tipo: string) {
  switch (tipo) {
    case 'SANGRE': return <Beaker className="h-5 w-5 text-red-500" />;
    case 'ORINA': return <FlaskConical className="h-5 w-5 text-amber-500" />;
    case 'HECES': return <Dna className="h-5 w-5 text-brown-500" />;
    default: return <FlaskConical className="h-5 w-5 text-gray-500" />;
  }
}

function EstadoOcrBadge({ estado }: { estado: string }) {
  switch (estado) {
    case 'PROCESANDO':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          <Loader2 className="h-3 w-3 animate-spin" />
          Procesando resultados...
        </span>
      );
    case 'COMPLETADO':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          Resultados disponibles
        </span>
      );
    case 'ERROR':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
          <AlertCircle className="h-3 w-3" />
          Error al procesar
        </span>
      );
    default:
      return null;
  }
}

export default function AnalysisResultViewer({ archivoId, title, onClose }: Props) {
  const [pollCount, setPollCount] = useState(0);

  const { data: resultData, isLoading, isError } = useQuery({
    queryKey: ['ocr-result', archivoId],
    queryFn: () => getOcrResults(archivoId),
    refetchInterval: (query) => {
      const data = query.state.data?.data;
      if (data?.estadoOcr === 'PROCESANDO' && pollCount < 30) {
        return 2000;
      }
      return false;
    },
  });

  useEffect(() => {
    if (resultData?.data?.estadoOcr === 'PROCESANDO') {
      const timer = setTimeout(() => setPollCount((c) => c + 1), 2000);
      return () => clearTimeout(timer);
    }
  }, [resultData?.data?.estadoOcr, pollCount]);

  const result = resultData?.data;

  if (isLoading && !result) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-xl">
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#008585]" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !result) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-3 py-12">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-sm text-gray-500">No se pudieron cargar los resultados</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            {getTipoIcon(result.tipoAnalisis)}
            <div>
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              {result.laboratorio && (
                <p className="text-xs text-gray-500">{result.laboratorio}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <EstadoOcrBadge estado={result.estadoOcr} />
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Info del laboratorio */}
        {result.estadoOcr === 'COMPLETADO' && (
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-3">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-600">
              {result.fechaResultado && (
                <span>Fecha resultado: {new Date(result.fechaResultado).toLocaleDateString('es-PE')}</span>
              )}
              {result.fechaToma && (
                <span>Fecha toma: {new Date(result.fechaToma).toLocaleDateString('es-PE')} {result.horaToma || ''}</span>
              )}
              {result.medicoSolicitante && (
                <span>Médico: {result.medicoSolicitante}</span>
              )}
              {result.resultadoIdOriginal && (
                <span>ID: {result.resultadoIdOriginal}</span>
              )}
            </div>
          </div>
        )}

        {/* Grupos */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {result.estadoOcr === 'PROCESANDO' ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-[#008585]/20 border-t-[#008585] animate-spin" />
              </div>
              <p className="text-sm font-medium text-gray-500">Procesando resultados del laboratorio...</p>
              <p className="text-xs text-gray-400">Esto puede tomar unos segundos</p>
            </div>
          ) : result.estadoOcr === 'ERROR' ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <AlertCircle className="h-10 w-10 text-red-400" />
              <p className="text-sm font-medium text-gray-500">Error al procesar el análisis</p>
              {result.errorOcr && (
                <p className="text-xs text-red-400">{result.errorOcr}</p>
              )}
            </div>
          ) : result.grupos.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <FlaskConical className="h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-500">No se encontraron resultados</p>
            </div>
          ) : (
            <div className="space-y-6">
              {result.grupos.map((grupo) => (
                <div key={grupo.id}>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#008585]">
                    {grupo.nombreGrupo}
                  </h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2.5 text-left font-medium text-gray-700">Parámetro</th>
                          <th className="px-4 py-2.5 text-right font-medium text-gray-700">Valor</th>
                          {grupo.items.some((i) => i.unidad) && (
                            <th className="px-4 py-2.5 text-left font-medium text-gray-700">Unidad</th>
                          )}
                          {grupo.items.some((i) => i.rangoMin || i.rangoMax || i.rangoReferencia) && (
                            <th className="px-4 py-2.5 text-left font-medium text-gray-700">Rango ref.</th>
                          )}
                          <th className="px-4 py-2.5 text-center font-medium text-gray-700">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {grupo.items.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50">
                            <td className="px-4 py-2.5 font-medium text-gray-800">{item.nombre}</td>
                            <td className={`px-4 py-2.5 text-right font-semibold ${
                              item.estado && item.estado !== 'normal' ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {item.valor}
                            </td>
                            {grupo.items.some((i) => i.unidad) && (
                              <td className="px-4 py-2.5 text-gray-500">{item.unidad || '—'}</td>
                            )}
                            {grupo.items.some((i) => i.rangoMin || i.rangoMax || i.rangoReferencia) && (
                              <td className="px-4 py-2.5 text-gray-500">
                                {item.rangoReferencia || (item.rangoMin && item.rangoMax ? `${item.rangoMin} - ${item.rangoMax}` : item.rangoMin || item.rangoMax || '—')}
                              </td>
                            )}
                            <td className="px-4 py-2.5 text-center">{getStatoBadge(item.estado)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {grupo.items.some((i) => i.nota) && (
                    <div className="mt-2 space-y-1">
                      {grupo.items.filter((i) => i.nota).map((item) => (
                        <p key={item.id} className="text-xs italic text-gray-400">
                          {item.nombre}: {item.nota}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-3">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
