
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from '../common/ErrorBoundary';
import { APIErrorFallback } from '../common/APIErrorBoundary';

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ErrorBoundary
        fallback={(error, resetErrorBoundary) => (
          <APIErrorFallback 
            error={error} 
            resetErrorBoundary={resetErrorBoundary}
            message="Failed to load header"
          />
        )}
      >
        <Header />
      </ErrorBoundary>
      
      <main className="flex-1">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      
      <ErrorBoundary
        fallback={(error, resetErrorBoundary) => (
          <APIErrorFallback 
            error={error} 
            resetErrorBoundary={resetErrorBoundary}
            message="Failed to load footer"
          />
        )}
      >
        <Footer />
      </ErrorBoundary>
    </div>
  );
};
