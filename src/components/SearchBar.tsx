
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: language === 'en' ? 'Error' : 'లోపం',
        description: language === 'en' 
          ? 'Please enter a search term' 
          : 'దయచేసి శోధన పదాన్ని నమోదు చేయండి',
        variant: 'destructive'
      });
      return;
    }
    
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={t('placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 pl-4 pr-10 rounded-lg border border-gray-300 focus:border-health-blue focus:ring-2 focus:ring-health-blue/20"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
        </div>
        <Button 
          type="submit" 
          className="h-12 px-6 bg-health-blue hover:bg-health-blue/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? t('loading') : t('searchBtn')}
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
