
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ContentBeats from './content/ContentBeats';
import ContentRemixes from './content/ContentRemixes';
import ContentCoverArt from './content/ContentCoverArt';
import { useQuery } from '@tanstack/react-query';
import { searchContent } from '@/lib/api/dashboard';
import { useDebounce } from '@/hooks/use-debounce';
import APIErrorBoundary from '../common/APIErrorBoundary';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('beats');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Only search when there's a search term and it's debounced
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['content-search', debouncedSearchTerm],
    queryFn: () => searchContent(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length >= 2,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <APIErrorBoundary fallbackMessage="Failed to load content management">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="beats">
                  Beats {searchResults?.beats?.length ? `(${searchResults.beats.length})` : ''}
                </TabsTrigger>
                <TabsTrigger value="remixes">
                  Remixes {searchResults?.remixes?.length ? `(${searchResults.remixes.length})` : ''}
                </TabsTrigger>
                <TabsTrigger value="coverArt">
                  Cover Art {searchResults?.coverArt?.length ? `(${searchResults.coverArt.length})` : ''}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="beats">
                <ContentBeats searchResults={searchResults?.beats} isSearching={isSearching} searchTerm={debouncedSearchTerm} />
              </TabsContent>
              
              <TabsContent value="remixes">
                <ContentRemixes searchResults={searchResults?.remixes} isSearching={isSearching} searchTerm={debouncedSearchTerm} />
              </TabsContent>
              
              <TabsContent value="coverArt">
                <ContentCoverArt searchResults={searchResults?.coverArt} isSearching={isSearching} searchTerm={debouncedSearchTerm} />
              </TabsContent>
            </Tabs>
          </APIErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
