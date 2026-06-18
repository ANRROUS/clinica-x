'use client';

import { Skeleton } from '@/components/shared/Skeleton';

export default function DoctorFormSkeleton() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="mt-4 h-5 w-40" />
              <Skeleton className="mt-2 h-4 w-24 rounded-full" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
