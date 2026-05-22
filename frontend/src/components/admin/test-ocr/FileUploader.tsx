'use client';

import { useCallback } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

interface Props {
  onUpload: (file: File) => void;
  uploading?: boolean;
  uploadedFile?: { name: string; size: number } | null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function FileUploader({ onUpload, uploading, uploadedFile }: Props) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) onUpload(file);
    },
    [onUpload],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">Archivo de análisis</label>
      {!uploadedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 transition hover:border-[#008585] hover:bg-[#008585]/5"
        >
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleChange}
            disabled={uploading}
            className="hidden"
            id="ocr-file-input"
          />
          <label htmlFor="ocr-file-input" className="flex cursor-pointer flex-col items-center">
            <UploadCloud className="h-10 w-10 text-gray-400" />
            <p className="mt-3 text-sm font-medium text-gray-700">
              {uploading ? 'Subiendo...' : 'Arrastra o haz clic para subir'}
            </p>
            <p className="mt-1 text-xs text-gray-500">PDF o imagen, máx. 1 MB</p>
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <FileText className="h-8 w-8 text-[#008585]" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
            <p className="text-xs text-gray-500">{formatBytes(uploadedFile.size)}</p>
          </div>
          <button
            onClick={() => onUpload(uploadedFile as unknown as File)}
            className="text-xs font-medium text-[#008585] hover:underline"
          >
            Cambiar
          </button>
        </div>
      )}
    </div>
  );
}
