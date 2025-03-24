
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-health-dark text-white py-8">
      <div className="bihealth-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('siteName')}</h3>
            <p className="text-sm text-gray-300">
              {t('tagline')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.disclaimer')}</h3>
            <p className="text-sm text-gray-300">
              {t('poweredBy')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {t('home')}
                </a>
              </li>
              <li>
                <a href="/predict" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {t('predict')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>
            &copy; {currentYear} {t('siteName')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
