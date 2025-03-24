
import React, { useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import DiseaseInfoCard from '@/components/DiseaseInfoCard';
import HeroSection from '@/components/HeroSection';
import { 
  WikipediaSearchResult, 
  WikipediaContent,
  searchWikipedia, 
  getWikipediaContent 
} from '@/services/wikipediaAPI';

const Index = () => {
  const { language } = useLanguage();
  const [searchResults, setSearchResults] = useState<WikipediaSearchResult[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<WikipediaContent | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSelectedDisease(null);
    setSearchQuery(query);
    
    try {
      const results = await searchWikipedia(query, language);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = async (result: WikipediaSearchResult) => {
    setIsLoadingContent(true);
    
    try {
      const content = await getWikipediaContent(result.pageid, language);
      if (content) {
        setSelectedDisease(content);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching disease content:', error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection onScrollToSearch={scrollToSearch} />
        
        <div ref={searchSectionRef} className="health-section bg-white py-12">
          <div className="bihealth-container">
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={isSearching}
            />
            
            <SearchResults 
              results={searchResults} 
              onSelectResult={handleSelectResult}
              isLoading={isSearching}
              searchQuery={searchQuery}
            />
            
            {isLoadingContent && (
              <div className="mt-8 w-full health-card shimmer h-64"></div>
            )}
            
            {selectedDisease && !isLoadingContent && (
              <div className="mt-8">
                <DiseaseInfoCard diseaseInfo={selectedDisease} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
