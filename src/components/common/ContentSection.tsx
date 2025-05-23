
import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface ContentSectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

const ContentSection = ({ children, title, className = '' }: ContentSectionProps) => {
  return (
    <ErrorBoundary>
      <section className={className}>
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        {children}
      </section>
    </ErrorBoundary>
  );
};

export default ContentSection;
