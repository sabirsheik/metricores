import React from 'react';

interface SkeletonProps {
  className?: string;
  id?: string;
}

// 1. Generic highly reusable Skeleton block
export function Skeleton({ className = '', id }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-zinc-200 rounded-lg ${className}`}
      id={id}
    />
  );
}

// 2. Exact match of the Left Side: Parameters Form / CalculatorCard
export function CalculatorCardSkeleton() {
  return (
    <div
      className="bg-white border border-zinc-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col space-y-5 w-full"
      id="calculator-card-skeleton"
    >
      {/* Skeleton Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <Skeleton className="h-4 w-36" />
      </div>

      {/* Skeleton Input Fields (typically 3-4 fields) */}
      <div className="space-y-4">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* Skeleton Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-grow rounded-xl" />
        <div className="flex gap-2 sm:w-auto">
          <Skeleton className="h-10 w-20 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// 3. Exact match of the Right Side: Results Card
export function ResultCardSkeleton() {
  return (
    <div
      className="bg-white border border-zinc-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between h-full min-h-[380px] w-full"
      id="result-card-skeleton"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <Skeleton className="h-4 w-28" />
          <div className="flex space-x-1.5">
            <Skeleton className="h-6 w-14 rounded-md" />
            <Skeleton className="h-6 w-14 rounded-md" />
          </div>
        </div>

        {/* Primary Large Value Badge */}
        <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-36 rounded-md" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Secondary lists */}
        <div className="space-y-3.5">
          {[1, 2].map((idx) => (
            <div key={idx} className="flex justify-between items-center py-1.5 border-b border-zinc-100/60">
              <div className="flex items-center space-x-2">
                <Skeleton className="w-1.5 h-1.5 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-3.5 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="pt-4 border-t border-zinc-100">
        <Skeleton className="h-3 w-full mb-1.5" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

export function CalculatorSuiteSkeleton() {
  return (
    <div className="directory-shell mx-auto w-[95%] space-y-10 px-4 py-12 md:px-6 md:py-16" aria-label="Loading calculator suites">
      <div className="mx-auto max-w-3xl space-y-3 text-center">
        <Skeleton className="mx-auto h-3 w-36" />
        <Skeleton className="mx-auto h-12 w-3/4" />
        <Skeleton className="mx-auto h-4 w-full max-w-xl" />
      </div>
      <div className="space-y-12">
        {[1, 2, 3].map((section) => (
          <section key={section} className="space-y-5">
            <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
              <div className="space-y-2"><Skeleton className="h-7 w-56" /><Skeleton className="h-3 w-72" /></div>
              <Skeleton className="hidden h-3 w-24 sm:block" />
            </div>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((card) => <Skeleton key={card} className="h-36 w-full rounded-xl" />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export function CalculatorWorkspaceSkeleton() {
  return (
    <div className="mx-auto grid w-[95%] max-w-6xl gap-6 px-4 py-12 md:grid-cols-2 md:px-6 md:py-16" aria-label="Loading calculator">
      <div className="space-y-5"><Skeleton className="h-4 w-28" /><Skeleton className="h-10 w-3/4" /><Skeleton className="h-4 w-full" /><CalculatorCardSkeleton /></div>
      <ResultCardSkeleton />
    </div>
  );
}
