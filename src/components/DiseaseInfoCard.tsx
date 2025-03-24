
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { WikipediaContent, getWikipediaSections, getWikipediaSectionContent } from '@/services/wikipediaAPI';
import { Loader2 } from 'lucide-react';

interface DiseaseInfoCardProps {
  diseaseInfo: WikipediaContent;
}

interface SectionData {
  title: string;
  content: string;
  index: number;
}

const DiseaseInfoCard: React.FC<DiseaseInfoCardProps> = ({ diseaseInfo }) => {
  const { t, language } = useLanguage();
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loadingSections, setLoadingSections] = useState<boolean>(true);

  // Find relevant sections for symptoms and precautions
  const symptomsSection = sections.find(section => 
    section.title.toLowerCase().includes('symptom') || 
    section.title.toLowerCase().includes('లక్షణాలు')
  );
  
  const precautionsSection = sections.find(section => 
    section.title.toLowerCase().includes('prevent') || 
    section.title.toLowerCase().includes('treatment') || 
    section.title.toLowerCase().includes('precaution') ||
    section.title.toLowerCase().includes('నివారణ') ||
    section.title.toLowerCase().includes('చికిత్స')
  );

  useEffect(() => {
    const fetchSections = async () => {
      setLoadingSections(true);
      try {
        // Get all sections of the article
        const sectionsData = await getWikipediaSections(diseaseInfo.pageid, language);
        
        // Filter for potentially relevant sections (first 5 sections)
        const relevantSections = sectionsData.sections.slice(0, 5);
        
        // Fetch content for each relevant section
        const sectionsWithContent: SectionData[] = await Promise.all(
          relevantSections.map(async (section) => {
            const sectionContent = await getWikipediaSectionContent(
              diseaseInfo.pageid, 
              parseInt(section.index), 
              language
            );
            
            return {
              title: section.line,
              content: sectionContent.content,
              index: parseInt(section.index)
            };
          })
        );
        
        setSections(sectionsWithContent);
      } catch (error) {
        console.error('Error fetching sections:', error);
      } finally {
        setLoadingSections(false);
      }
    };

    if (diseaseInfo && diseaseInfo.pageid) {
      fetchSections();
    }
  }, [diseaseInfo, language]);

  // Function to clean HTML content
  const cleanHtml = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove references ([1], [2], etc.)
    const referenceElements = tempDiv.querySelectorAll('.reference');
    referenceElements.forEach(el => el.remove());
    
    return tempDiv.innerHTML;
  };

  return (
    <Card className="w-full health-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{diseaseInfo.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {diseaseInfo.thumbnail && (
            <div className="md:col-span-1 flex justify-center md:justify-start mb-4 md:mb-0">
              <img 
                src={diseaseInfo.thumbnail.source} 
                alt={diseaseInfo.title} 
                className="rounded-lg max-h-60 object-cover"
              />
            </div>
          )}
          
          <div className={`${diseaseInfo.thumbnail ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <p className="text-gray-700 mb-6">{diseaseInfo.extract}</p>
            
            <Tabs defaultValue="symptoms">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="symptoms">{t('symptoms')}</TabsTrigger>
                <TabsTrigger value="precautions">{t('precautions')}</TabsTrigger>
                <TabsTrigger value="moreInfo">{t('moreInfo')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="symptoms" className="pt-4">
                {loadingSections ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-health-blue" />
                  </div>
                ) : symptomsSection ? (
                  <div dangerouslySetInnerHTML={{ __html: cleanHtml(symptomsSection.content) }} />
                ) : (
                  <p className="text-gray-500 italic">
                    {language === 'en' 
                      ? 'Symptoms information not available. Please check the More Information tab.' 
                      : 'లక్షణాల సమాచారం అందుబాటులో లేదు. దయచేసి మరింత సమాచారం ట్యాబ్‌ను తనిఖీ చేయండి.'}
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="precautions" className="pt-4">
                {loadingSections ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-health-blue" />
                  </div>
                ) : precautionsSection ? (
                  <div dangerouslySetInnerHTML={{ __html: cleanHtml(precautionsSection.content) }} />
                ) : (
                  <p className="text-gray-500 italic">
                    {language === 'en' 
                      ? 'Precautions information not available. Please check the More Information tab.' 
                      : 'జాగ్రత్తల సమాచారం అందుబాటులో లేదు. దయచేసి మరింత సమాచారం ట్యాబ్‌ను తనిఖీ చేయండి.'}
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="moreInfo" className="pt-4">
                <p className="mb-4">
                  {language === 'en' 
                    ? 'For more detailed information, please visit:' 
                    : 'మరింత వివరణాత్మక సమాచారం కోసం, దయచేసి సందర్శించండి:'}
                </p>
                <a 
                  href={`https://${language}.wikipedia.org/?curid=${diseaseInfo.pageid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-health-blue hover:underline font-medium"
                >
                  {language === 'en' ? 'View full article on Wikipedia' : 'వికీపీడియాలో పూర్తి వ్యాసాన్ని చూడండి'}
                </a>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiseaseInfoCard;
