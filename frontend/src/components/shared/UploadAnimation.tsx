'use client';

import React from 'react';

/**
 * Animación de subida de documento — Propuesta 1
 * Documento flotante con líneas de progreso y partículas ascendentes.
 */
export default function UploadAnimation({ label = 'Subiendo documento...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <style>{`
        @keyframes floatDoc {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-40px); }
        }
        @keyframes growLine {
          0%, 100% { transform: translateX(-50%) scaleY(0); opacity: 0.3; }
          50% { transform: translateX(-50%) scaleY(1); opacity: 1; }
        }
        @keyframes particleUp {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-100px) scale(0); opacity: 0; }
        }
        .ua-line {
          position: absolute; left: 50%; transform: translateX(-50%);
          width: 4px; background: #7FCDCD; border-radius: 2px; opacity: 0.4;
        }
        .ua-line-1 { bottom: 40px; height: 60px; animation: growLine 1.8s ease-in-out infinite; }
        .ua-line-2 { bottom: 50px; height: 80px; animation: growLine 1.8s ease-in-out 0.3s infinite; }
        .ua-line-3 { bottom: 30px; height: 50px; animation: growLine 1.8s ease-in-out 0.6s infinite; }
        .ua-doc {
          position: absolute; left: 50%; bottom: 60px;
          transform: translateX(-50%);
          animation: floatDoc 1.8s ease-in-out infinite;
        }
        .ua-particle {
          position: absolute; width: 6px; height: 6px; border-radius: 50%; background: #31b9ad; opacity: 0;
        }
        .ua-p1 { left: 40%; bottom: 20px; animation: particleUp 1.8s ease-out infinite; }
        .ua-p2 { left: 60%; bottom: 30px; animation: particleUp 1.8s ease-out 0.4s infinite; }
        .ua-p3 { left: 50%; bottom: 15px; animation: particleUp 1.8s ease-out 0.8s infinite; }
      `}</style>
      <div className="relative w-[220px] h-[220px]">
        <div className="ua-line ua-line-1" />
        <div className="ua-line ua-line-2" />
        <div className="ua-line ua-line-3" />
        <div className="ua-particle ua-p1" />
        <div className="ua-particle ua-p2" />
        <div className="ua-particle ua-p3" />
        <div className="ua-doc">
          <svg width="64" height="80" viewBox="0 0 64 80" fill="none" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,133,133,0.25))' }}>
            <rect x="4" y="4" width="56" height="72" rx="6" fill="white" stroke="#008585" strokeWidth="2" />
            <path d="M20 28H44" stroke="#7FCDCD" strokeWidth="3" strokeLinecap="round" />
            <path d="M20 40H44" stroke="#7FCDCD" strokeWidth="3" strokeLinecap="round" />
            <path d="M20 52H36" stroke="#7FCDCD" strokeWidth="3" strokeLinecap="round" />
            <path d="M44 4V16C44 19.3137 46.6863 22 50 22H60" stroke="#008585" strokeWidth="2" fill="white" />
          </svg>
        </div>
      </div>
      <span className="text-sm tracking-[1px] uppercase text-[#008585] font-medium">
        {label}
      </span>
    </div>
  );
}
