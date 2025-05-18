
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ContentBeats from './content/ContentBeats';
import ContentRemixes from './content/ContentRemixes';
import ContentCoverArt from './content/ContentCoverArt';
import { fetchBeats, fetchRemixes, fetchCoverArt } from '@/lib/api';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('beats');
  
  // Pre-fetch data for better UX
  const { data: beats, isLoading: beatsLoading, error: beatsError } = useQuery({
    queryKey: ['beats'],
    queryFn: fetchBeats
  });
  
  const { data: remixes, isLoading: remixesLoading, error: remixesError } = useQuery({
    queryKey: ['remixes'],
    queryFn: fetchRemixes
  });
  
  const { data: coverArt, isLoading: coverArtLoading, error: coverArtError } = useQuery({
    queryKey: ['coverArt'],
    queryFn: fetchCoverArt
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>
      
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="beats">
                Beats {beats ? `(${beats.length})` : ''}
              </TabsTrigger>
              <TabsTrigger value="remixes">
                Remixes {remixes ? `(${remixes.length})` : ''}
              </TabsTrigger>
              <TabsTrigger value="coverArt">
                Cover Art {coverArt ? `(${coverArt.length})` : ''}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="beats">
              <ContentBeats />
            </TabsContent>
            
            <TabsContent value="remixes">
              <ContentRemixes />
            </TabsContent>
            
            <TabsContent value="coverArt">
              <ContentCoverArt />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
