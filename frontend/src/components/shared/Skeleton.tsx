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

// ─── Doctor Portal Skeletons ─────────────────────────────────────────────

export function PatientSidebarSkeleton() {
  const PatientItemSkeleton = () => (
    <div className="flex items-center gap-3 rounded-lg border-l-4 border-white/20 bg-white/10 px-3 py-2">
      <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-white/20" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-28 animate-pulse rounded bg-white/20" />
        <div className="h-2.5 w-16 animate-pulse rounded bg-white/20" />
      </div>
    </div>
  );

  return (
    <aside className="flex h-full w-72 flex-col bg-brand-500">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="h-4 w-16 animate-pulse rounded bg-white/20" />
        <div className="h-6 w-6 animate-pulse rounded bg-white/20" />
      </div>

      {/* Actual */}
      <div className="px-4 py-2">
        <div className="mb-2 h-3 w-10 animate-pulse rounded bg-white/20" />
        <PatientItemSkeleton />
      </div>

      {/* Para hoy */}
      <div className="px-4 py-2">
        <div className="mb-2 h-3 w-14 animate-pulse rounded bg-white/20" />
        <div className="space-y-1">
          {[1, 2, 3].map((i) => (
            <PatientItemSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* General */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="mb-2 h-3 w-12 animate-pulse rounded bg-white/20" />
        <div className="space-y-1">
          {[1, 2, 3, 4].map((i) => (
            <PatientItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </aside>
  );
}

export function PatientHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export function PatientTabsSkeleton() {
  return (
    <div className="flex bg-white px-6 py-3 gap-2">
      <Skeleton className="h-9 w-28 rounded-full" />
      <Skeleton className="h-9 w-36 rounded-full" />
    </div>
  );
}

export function ActiveConsultationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>
    </div>
  );
}

export function ConsultationListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
