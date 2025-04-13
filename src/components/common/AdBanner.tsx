
import React from 'react';

interface AdBannerProps {
  type?: 'header' | 'content' | 'sidebar';
  className?: string;
}

const AdBanner = ({ type = 'content', className = '' }: AdBannerProps) => {
  // Size based on ad type
  const adSizes: Record<string, { width: string; height: string }> = {
    header: { width: 'w-full md:w-[728px]', height: 'h-[90px]' },
    content: { width: 'w-full', height: 'h-[250px]' },
    sidebar: { width: 'w-[300px]', height: 'h-[600px]' },
  };
  
  const { width, height } = adSizes[type];
  
  return (
    <div className={`my-4 mx-auto ${width} ${className}`}>
      <div className="bg-secondary/10 border border-border rounded-md p-2 text-center overflow-hidden hover:border-fuchsia-500/50 transition-all duration-300">
        <p className="text-xs text-muted-foreground mb-1">Advertisement</p>
        <div className={`${height} flex items-center justify-center`}>
          <p className="text-sm text-muted-foreground">Ad Banner Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
