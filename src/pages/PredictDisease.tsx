
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';

const PredictDisease = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="health-section bg-white py-8">
          <div className="bihealth-container">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-clip-text text-transparent health-gradient">
              {t('predict')}
            </h1>
            
            <p className="text-center text-gray-600 mb-8">
              {t('language') === 'en' ? 
                "Use our interactive tool to predict possible diseases based on your symptoms." :
                "మీ లక్షణాల ఆధారంగా సంభావ్య వ్యాధులను అంచనా వేయడానికి మా ఇంటరాక్టివ్ టూల్‌ని ఉపయోగించండి."
              }
            </p>
            
            <div className="flex justify-center">
              <iframe
                src="https://asnvs-symptomsdiseasepredction.hf.space"
                frameBorder="0"
                width="850"
                height="450"
                className="max-w-full border rounded-lg shadow-lg"
                title="Disease Prediction Tool"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PredictDisease;
