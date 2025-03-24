
import React from 'react';
import { Spinner } from './spinner';

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = "md" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Spinner size={size} />
      <p className="text-gray-500 animate-pulse">{message}</p>
    </div>
  );
};
