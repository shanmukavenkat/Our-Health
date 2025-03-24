
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { WikipediaSearchResult } from '@/services/wikipediaAPI';
import { Card, CardContent } from '@/components/ui/card';

interface SearchResultsProps {
  results: WikipediaSearchResult[];
  onSelectResult: (result: WikipediaSearchResult) => void;
  isLoading: boolean;
  searchQuery?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  onSelectResult,
  isLoading,
  searchQuery
}) => {
  const { t, language } = useLanguage();

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shimmer cursor-pointer border border-gray-200">
            <CardContent className="p-4">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0 && searchQuery) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-6">
        <Card className="border border-gray-200">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              {language === 'te' 
                ? `"${searchQuery}" కోసం ఫలితాలు కనుగొనబడలేదు. మరొక శోధన పదాన్ని ప్రయత్నించండి.` 
                : `No results found for "${searchQuery}". Try another search term.`}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (results.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-6">
        <Card className="border border-gray-200">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">{t('noResults')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 space-y-4">
      {results.map((result) => (
        <Card 
          key={result.pageid}
          className="cursor-pointer border border-gray-200 hover:border-health-blue hover:shadow-md transition-all"
          onClick={() => onSelectResult(result)}
        >
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-1">{result.title}</h3>
            <div 
              dangerouslySetInnerHTML={{ __html: result.snippet + '...' }} 
              className="text-gray-600 text-sm"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;
