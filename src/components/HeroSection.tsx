
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeroSectionProps {
  onScrollToSearch: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToSearch }) => {
  const { t } = useLanguage();

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-health-blue/10 to-health-purple/10 z-0"></div>
      <div className="relative z-10 py-16 md:py-24 bihealth-container">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent health-gradient">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <button 
            onClick={onScrollToSearch}
            className="px-6 py-3 bg-health-blue hover:bg-health-blue/90 text-white rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
          >
            {t('hero.cta')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
