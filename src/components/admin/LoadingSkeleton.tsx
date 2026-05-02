'use client';

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function LoadingSkeleton({ 
  rows = 5, 
  columns = 4,
  className = '' 
}: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Header */}
      <div className="flex gap-4 mb-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div 
            key={`header-${i}`} 
            className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"
          />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 mb-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={`cell-${rowIndex}-${colIndex}`} 
              className="h-12 bg-gray-100 dark:bg-gray-800 rounded flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white dark:bg-gray-800 rounded-xl p-6 ${className}`}>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full mb-2" />
      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
    </div>
  );
}

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-6"
        >
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
      ))}
    </div>
  );
}
