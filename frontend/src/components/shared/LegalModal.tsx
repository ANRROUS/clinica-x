import { X } from 'lucide-react';
import Link from 'next/link';

interface LegalModalProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalModal({ title, children }: LegalModalProps) {
  return (
    <div className="min-h-screen bg-[#002855] px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="relative rounded-2xl bg-[#002855] p-8 text-white md:p-12">
          <Link
            href="/"
            className="absolute right-4 top-4 text-white/70 transition hover:text-white md:right-6 md:top-6"
          >
            <X className="h-6 w-6" />
          </Link>
          <h1 className="text-center text-2xl font-bold text-white md:text-3xl">
            {title}
          </h1>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-white/90">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
