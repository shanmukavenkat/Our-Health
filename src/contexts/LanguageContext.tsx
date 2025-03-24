
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'te';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    siteName: 'ManaHealth',
    tagline: 'Your bilingual guide to health information',
    search: 'Search for diseases, symptoms, or treatments...',
    searchBtn: 'Search',
    languageSwitch: 'తెలుగు',
    home: 'Home',
    predict: 'Predict Disease',
    about: 'About',
    noResults: 'No results found. Try another search term.',
    loading: 'Loading...',
    symptoms: 'Symptoms',
    precautions: 'Precautions',
    moreInfo: 'More Information',
    poweredBy: 'Information powered by Wikipedia',
    placeholder: 'Search for any disease in English or Telugu',
    hero: {
      title: 'Comprehensive Health Information in Your Language',
      subtitle: 'Search for diseases, learn about symptoms, and discover precautionary measures',
      cta: 'Start your search now'
    },
    footer: {
      rights: 'All rights reserved',
      disclaimer: 'This website provides general information and is not a substitute for professional medical advice.'
    }
  },
  te: {
    siteName: 'మాన్నా హెల్త్',
    tagline: 'ఆరోగ్య సమాచారం కోసం మీ ద్విభాషా మార్గదర్శి',
    search: 'వ్యాధులు, లక్షణాలు లేదా చికిత్సల కోసం శోధించండి...',
    searchBtn: 'శోధించు',
    languageSwitch: 'English',
    home: 'హోమ్',
    predict: 'వ్యాధిని అంచనా వేయండి',
    about: 'గురించి',
    noResults: 'ఫలితాలు కనుగొనబడలేదు. మరొక శోధన పదాన్ని ప్రయత్నించండి.',
    loading: 'లోడ్ అవుతోంది...',
    symptoms: 'లక్షణాలు',
    precautions: 'జాగ్రత్తలు',
    moreInfo: 'మరింత సమాచారం',
    poweredBy: 'వికీపీడియా ద్వారా సమాచారం అందించబడింది',
    placeholder: 'ఆంగ్లం లేదా తెలుగులో ఏదైనా వ్యాధి కోసం శోధించండి',
    hero: {
      title: 'మీ భాషలో సమగ్ర ఆరోగ్య సమాచారం',
      subtitle: 'వ్యాధులను శోధించండి, లక్షణాల గురించి తెలుసుకోండి మరియు జాగ్రత్త చర్యలను కనుగొనండి',
      cta: 'ఇప్పుడే మీ శోధనను ప్రారంభించండి'
    },
    footer: {
      rights: 'అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి',
      disclaimer: 'ఈ వెబ్‌సైట్ సాధారణ సమాచారాన్ని అందిస్తుంది మరియు ఇది వృత్తిపరమైన వైద్య సలహాకు ప్రత్యామ్నాయం కాదు.'
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        return key;
      }
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
