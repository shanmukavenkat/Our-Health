
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'te' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="bihealth-container">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="health-gradient w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
               M
              </div>
              <span className="text-xl font-semibold bg-clip-text text-transparent health-gradient">
                {t('siteName')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
              {t('home')}
            </Link>
            <Link to="/predict" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
              {t('predict')}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleLanguage} 
              className="flex items-center gap-1"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">{t('languageSwitch')}</span>
            </Button>

            {/* Mobile Navigation */}
            {isMobile && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu size={24} />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="health-gradient w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
                            M
                          </div>
                          <span className="text-lg font-semibold bg-clip-text text-transparent health-gradient">
                            {t('siteName')}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                          <X size={18} />
                        </Button>
                      </div>
                    </div>
                    <nav className="flex-1 p-4">
                      <div className="flex flex-col space-y-3">
                        <Link 
                          to="/" 
                          className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {t('home')}
                        </Link>
                        <Link 
                          to="/predict" 
                          className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {t('predict')}
                        </Link>
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
