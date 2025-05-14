
import React from 'react';
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/common/PageHeader";
import RemixCardContainer from '@/components/remixes/RemixCardContainer';

const Remixes: React.FC = () => {
  return (
    <PageLayout>
      <PageHeader 
        title="Remixes" 
        description="Download free remixes of popular songs. All remixes are for promotional purposes only." 
      />
      
      <div className="container py-8 max-w-6xl">
        <div className="mb-6 p-4 bg-secondary/40 rounded-lg text-sm">
          <p className="font-medium">Fair Use Notice:</p>
          <p>These remixes contain samples and vocals from copyrighted materials, used under Fair Use for non-commercial, 
          transformative purposes only. Do not monetize or distribute commercially.</p>
        </div>
        
        <RemixCardContainer />
      </div>
    </PageLayout>
  );
};

export default Remixes;
