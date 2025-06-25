import React, { Suspense } from 'react';

interface LoadingProps {
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingProps> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="rounded-xl bg-muted/50 h-32 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted/50 rounded w-3/4"></div>
        <div className="h-4 bg-muted/50 rounded w-1/2"></div>
      </div>
    </div>
  );
};

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <LoadingSkeleton /> 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};
