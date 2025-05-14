
import React from 'react';
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/common/PageHeader";
import ArtCardContainer from '@/components/cover-art/ArtCardContainer';

const CoverArt: React.FC = () => {
  return (
    <PageLayout>
      <PageHeader 
        title="Cover Art" 
        description="Download free cover art for your music. All artwork is free for non-commercial use." 
      />
      
      <div className="container py-8 max-w-6xl">
        <ArtCardContainer />
      </div>
    </PageLayout>
  );
};

export default CoverArt;
