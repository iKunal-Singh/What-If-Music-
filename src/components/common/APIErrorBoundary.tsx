
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ErrorBoundary from './ErrorBoundary';

interface APIErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  message?: string;
}

export const APIErrorFallback = ({ 
  error, 
  resetErrorBoundary,
  message = "We couldn't load this content"
}: APIErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 border border-red-200 bg-red-50 rounded-md">
      <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h2>
      <p className="text-red-600 mb-4">
        {message}: {error.message}
      </p>
      <Button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
};

interface APIErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
  fallbackMessage?: string;
}

const APIErrorBoundary = ({ children, onReset, fallbackMessage }: APIErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      fallback={(error: Error, resetErrorBoundary: () => void) => (
        <APIErrorFallback 
          error={error} 
          resetErrorBoundary={() => {
            resetErrorBoundary();
            onReset?.();
          }} 
          message={fallbackMessage}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export default APIErrorBoundary;
