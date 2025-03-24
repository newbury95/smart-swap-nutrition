
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type SkeletonType = 'card' | 'list' | 'table' | 'text' | 'chart';

interface SkeletonLoaderProps {
  type: SkeletonType;
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type, 
  count = 3, 
  className 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`rounded-lg border p-4 ${className}`}>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        );
      
      case 'list':
        return (
          <div className={`space-y-3 ${className}`}>
            {Array(count).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'table':
        return (
          <div className={`border rounded-md ${className}`}>
            <div className="p-4 border-b bg-muted/30">
              <div className="flex">
                <Skeleton className="h-5 w-1/4 mr-2" />
                <Skeleton className="h-5 w-1/4 mr-2" />
                <Skeleton className="h-5 w-1/4 mr-2" />
                <Skeleton className="h-5 w-1/4" />
              </div>
            </div>
            <div className="p-4 space-y-4">
              {Array(count).fill(0).map((_, i) => (
                <div key={i} className="flex">
                  <Skeleton className="h-4 w-1/4 mr-2" />
                  <Skeleton className="h-4 w-1/4 mr-2" />
                  <Skeleton className="h-4 w-1/4 mr-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'chart':
        return (
          <div className={`rounded-lg border p-4 ${className}`}>
            <Skeleton className="h-8 w-1/4 mb-6" />
            <Skeleton className="h-[200px] w-full rounded-md" />
          </div>
        );
      
      case 'text':
      default:
        return (
          <div className={`space-y-2 ${className}`}>
            {Array(count).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        );
    }
  };

  return <>{renderSkeleton()}</>;
};
