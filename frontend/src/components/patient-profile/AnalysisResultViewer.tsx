'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, X, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import { getFileSignedUrl } from '@/lib/api/medical.api';

interface Props {
  archivoId: string;
  title: string;
  onClose: () => void;
}

export default function AnalysisResultViewer({ archivoId, title, onClose }: Props) {
  const [showPdf, setShowPdf] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // URL firmada del PDF
  const { data: signedUrlData, isLoading: isLoadingUrl } = useQuery({
    queryKey: ['file-signed-url', archivoId],
    queryFn: () => getFileSignedUrl(archivoId),
    enabled: !!archivoId,
  });

  const pdfUrl = signedUrlData?.data?.url || null;

  const handleOpenPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#008585]" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pdfUrl && (
              <button
                onClick={handleOpenPdf}
                className="inline-flex items-center gap-1 rounded-lg bg-[#008585] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#007070] transition"
              >
                <ExternalLink className="h-3 w-3" />
                Abrir PDF
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Contenido: PDF */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {pdfUrl ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Documento original</span>
                <button
                  onClick={() => setShowPdf((s) => !s)}
                  className="text-xs text-[#008585] hover:underline"
                >
                  {showPdf ? 'Ocultar PDF' : 'Mostrar PDF'}
                </button>
              </div>
              {showPdf && (
                <div className="rounded-lg border border-gray-200 overflow-hidden" style={{ height: 500 }}>
                  <iframe
                    src={pdfUrl}
                    title="PDF del análisis"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          ) : isLoadingUrl ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#008585]" />
              <span className="ml-2 text-sm text-gray-500">Cargando documento...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-8">
              <AlertCircle className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-400">No se pudo cargar el documento PDF</p>
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

  if (!mounted) return null;
  return createPortal(modal, document.body);
}
