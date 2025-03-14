
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-md">
      <h2 className="text-lg font-medium text-red-800 mb-2">Something went wrong:</h2>
      <pre className="text-sm text-red-600 overflow-auto p-2 bg-red-100 rounded">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
      >
        Try again
      </button>
    </div>
  );
};

export const GlobalErrorBoundary: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
        window.location.href = '/';
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
