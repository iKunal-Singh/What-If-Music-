
import React from 'react';
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/common/PageHeader";
import BeatCardContainer from '@/components/beats/BeatCardContainer';

const Beats: React.FC = () => {
  return (
    <PageLayout>
      <PageHeader 
        title="Free Beats" 
        description="Download free beats for your next project. All beats are free for non-commercial use." 
      />
      
      <div className="container py-8 max-w-6xl">
        <BeatCardContainer />
      </div>
    </PageLayout>
  );
};

export default Beats;
