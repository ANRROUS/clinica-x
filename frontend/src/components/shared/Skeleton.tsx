'use client';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
    />
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function SlotSkeleton() {
  return <Skeleton className="h-9 w-28 rounded-lg" />;
}

export function AppointmentCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <Skeleton className="mb-2 h-5 w-40" />
      <Skeleton className="mb-1 h-4 w-32" />
      <Skeleton className="mb-3 h-4 w-48" />
      <Skeleton className="h-5 w-20 rounded-full" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function ConsultationCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <Skeleton className="mb-1 h-4 w-36" />
      <Skeleton className="mb-1 h-3 w-48" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}
