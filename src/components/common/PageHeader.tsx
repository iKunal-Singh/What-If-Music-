
import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="bg-gradient-to-r from-background to-background/80 py-12 border-b border-border">
      <div className="container max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {title}
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  );
};
