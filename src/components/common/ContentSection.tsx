
import React, { ReactNode } from 'react';
import APIErrorBoundary from './APIErrorBoundary';

interface ContentSectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
  onErrorReset?: () => void;
  errorMessage?: string;
}

const ContentSection = ({ 
  children, 
  title, 
  className = '',
  onErrorReset,
  errorMessage = "Failed to load content"
}: ContentSectionProps) => {
  return (
    <APIErrorBoundary onReset={onErrorReset} fallbackMessage={errorMessage}>
      <section className={className}>
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        {children}
      </section>
    </APIErrorBoundary>
  );
};

export default ContentSection;
