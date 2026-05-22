'use client';

import type { AnalisisResultadoDTO, AnalisisGrupoDTO, AnalisisItemDTO } from '@/lib/api/types';

interface Props {
  data: AnalisisResultadoDTO;
}

function StatusBadge({ estado }: { estado?: string }) {
  const style =
    estado?.toLowerCase() === 'abnormal'
      ? 'bg-red-100 text-red-700'
      : 'bg-green-100 text-green-700';
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {estado || 'normal'}
    </span>
  );
}

function ItemRow({ item }: { item: AnalisisItemDTO }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="px-4 py-2.5 text-sm text-gray-800">{item.nombre}</td>
      <td className="px-4 py-2.5 text-sm font-semibold text-gray-900">{item.valor}</td>
      <td className="px-4 py-2.5 text-sm text-gray-600">{item.unidad || '—'}</td>
      <td className="px-4 py-2.5 text-sm text-gray-600">
        {item.rangoReferencia || `${item.rangoMin || '—'} – ${item.rangoMax || '—'}`}
      </td>
      <td className="px-4 py-2.5">
        <StatusBadge estado={item.estado} />
      </td>
      <td className="px-4 py-2.5 text-xs text-gray-500">{item.nota || '—'}</td>
    </tr>
  );
}

function GrupoSection({ grupo }: { grupo: AnalisisGrupoDTO }) {
  return (
    <div className="mb-6">
      <h4 className="mb-2 px-4 text-sm font-bold uppercase tracking-wide text-[#008585]">
        {grupo.nombreGrupo}
      </h4>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="px-4 py-2.5">Parámetro</th>
              <th className="px-4 py-2.5">Valor</th>
              <th className="px-4 py-2.5">Unidad</th>
              <th className="px-4 py-2.5">Rango Referencia</th>
              <th className="px-4 py-2.5">Estado</th>
              <th className="px-4 py-2.5">Nota</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {grupo.items.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OcrResultsTable({ data }: Props) {
  return (
    <div className="space-y-4">
      {/* Metadata header */}
      <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.laboratorio && (
            <p>
              <span className="font-medium">Laboratorio:</span> {data.laboratorio}
            </p>
          )}
          {data.medicoSolicitante && (
            <p>
              <span className="font-medium">Médico:</span> {data.medicoSolicitante}
            </p>
          )}
          {data.fechaToma && (
            <p>
              <span className="font-medium">Fecha toma:</span> {data.fechaToma}
            </p>
          )}
          {data.horaToma && (
            <p>
              <span className="font-medium">Hora toma:</span> {data.horaToma}
            </p>
          )}
          {data.pacienteNombreOcr && (
            <p>
              <span className="font-medium">Paciente (OCR):</span> {data.pacienteNombreOcr}
            </p>
          )}
          {data.pacienteSexo && (
            <p>
              <span className="font-medium">Sexo:</span> {data.pacienteSexo}
            </p>
          )}
          {data.pacienteEdad !== undefined && (
            <p>
              <span className="font-medium">Edad:</span> {data.pacienteEdad}
            </p>
          )}
        </div>
      </div>

      {/* Grupos */}
      {data.grupos.map((grupo) => (
        <GrupoSection key={grupo.id} grupo={grupo} />
      ))}

      {data.grupos.length === 0 && (
        <div className="rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">
            No se encontraron grupos de análisis en el resultado OCR.
          </p>
        </div>
      )}

      {data.grupos.some(g => g.items.length === 0) && (
        <div className="rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">
            No se pudieron extraer los valores de la tabla. El formato del PDF puede no ser reconocible.
          </p>
        </div>
      )}
    </div>
  );
}
