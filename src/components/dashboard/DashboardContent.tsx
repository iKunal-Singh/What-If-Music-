
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ContentBeats from './content/ContentBeats';
import ContentRemixes from './content/ContentRemixes';
import ContentCoverArt from './content/ContentCoverArt';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('beats');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>
      
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="beats">Beats</TabsTrigger>
              <TabsTrigger value="remixes">Remixes</TabsTrigger>
              <TabsTrigger value="coverArt">Cover Art</TabsTrigger>
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
