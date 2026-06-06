"use client";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = "", variant = "text", width, height }: SkeletonProps) {
  const baseClass = "animate-pulse bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] animate-shimmer rounded";
  const variants = {
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-xl h-64 w-full",
  };

  return (
    <div
      className={`${baseClass} ${variants[variant]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,0,0,0.05),transparent_70%)]" />
      <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-6xl relative z-10">
        <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full border border-red-900/20 bg-zinc-950/50 skeleton-pulse flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full border border-red-900/10 animate-ping opacity-20" />
        </div>
        <div className="flex-1 space-y-8">
          <div className="space-y-3">
            <Skeleton variant="text" className="h-14 w-3/4 bg-red-950/20" />
            <Skeleton variant="text" className="h-8 w-1/2" />
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" className="h-4 w-full opacity-50" />
            <Skeleton variant="text" className="h-4 w-2/3 opacity-30" />
          </div>
          <div className="flex gap-4 pt-4">
            <div className="w-36 h-12 rounded-full border border-red-900/30 bg-zinc-900/40 skeleton-pulse" />
            <div className="w-36 h-12 rounded-full border border-zinc-800 bg-zinc-900/20 skeleton-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <section className="py-24 px-4 bg-zinc-950/20">
      <div className="max-w-6xl mx-auto">
        <div className="w-48 h-10 mx-auto mb-16 rounded-full border border-red-900/10 bg-zinc-900/40 skeleton-pulse" />
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="h-96 w-full rounded-2xl border border-zinc-800 bg-zinc-900/20 skeleton-pulse" />
          <div className="space-y-6">
            <Skeleton variant="text" className="h-6 w-full opacity-60" />
            <Skeleton variant="text" className="h-6 w-full opacity-40" />
            <Skeleton variant="text" className="h-6 w-3/4 opacity-30" />
            <div className="grid grid-cols-2 gap-4 pt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 rounded-xl border border-zinc-800 bg-zinc-900/10 skeleton-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProjectsSkeleton() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <Skeleton variant="text" className="h-10 w-48 mx-auto mb-4" />
        <Skeleton variant="text" className="h-4 w-64 mx-auto mb-12" />
        <div className="flex gap-4 justify-center mb-12">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" className="h-10 w-24" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    </section>
  );
}
