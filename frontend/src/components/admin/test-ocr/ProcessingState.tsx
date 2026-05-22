'use client';

import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  estado: 'PROCESANDO' | 'COMPLETADO' | 'ERROR' | 'NO_PROCESADO';
  errorOcr?: string;
}

export default function ProcessingState({ estado, errorOcr }: Props) {
  if (estado === 'NO_PROCESADO') return null;

  if (estado === 'PROCESANDO') {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <span>Procesando OCR… Esto puede tardar unos segundos.</span>
      </div>
    );
  }

  if (estado === 'ERROR') {
    return (
      <div className="flex items-start gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        <div>
          <p className="font-medium">Error en el procesamiento OCR</p>
          {errorOcr && <p className="mt-1 text-xs">{errorOcr}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
      <CheckCircle2 className="h-5 w-5 text-green-600" />
      <span>OCR completado exitosamente.</span>
    </div>
  );
}
