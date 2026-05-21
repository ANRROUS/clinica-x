'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function AuthModal({ isOpen, onClose, children }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl sm:mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
}
