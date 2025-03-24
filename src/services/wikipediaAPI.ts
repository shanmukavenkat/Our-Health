// Determines which Wikipedia API to use based on language
const getApiUrlByLanguage = (language: string) => {
  return language === 'te' 
    ? 'https://te.wikipedia.org/w/api.php'
    : 'https://en.wikipedia.org/w/api.php';
};

export interface WikipediaSearchResult {
  pageid: number;
  title: string;
  snippet: string;
}

export interface WikipediaContent {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
  };
  pageid: number;
}

// Search Wikipedia for a term
export const searchWikipedia = async (
  searchTerm: string, 
  language: 'en' | 'te'
): Promise<WikipediaSearchResult[]> => {
  try {
    // First try to search in the requested language
    const apiUrl = getApiUrlByLanguage(language);
    const url = new URL(apiUrl);
    
    url.searchParams.append('action', 'query');
    url.searchParams.append('list', 'search');
    url.searchParams.append('srsearch', searchTerm);
    url.searchParams.append('format', 'json');
    url.searchParams.append('origin', '*');
    
    const response = await fetch(url.toString());
    const data = await response.json();
    const results = data.query?.search || [];
    
    // If we got results in the requested language, return them
    if (results.length > 0) {
      return results;
    }
    
    // If searching in Telugu and no results, try English Wikipedia as fallback
    if (language === 'te') {
      // Try to find the equivalent in English and then search for it in Telugu
      const enUrl = new URL('https://en.wikipedia.org/w/api.php');
      enUrl.searchParams.append('action', 'query');
      enUrl.searchParams.append('list', 'search');
      enUrl.searchParams.append('srsearch', searchTerm);
      enUrl.searchParams.append('format', 'json');
      enUrl.searchParams.append('origin', '*');
      
      const enResponse = await fetch(enUrl.toString());
      const enData = await enResponse.json();
      
      if (enData.query?.search && enData.query.search.length > 0) {
        // Get first English result title
        const enTitle = enData.query.search[0].title;
        
        // Try to find the Telugu equivalent using interlanguage links
        const langLinksUrl = new URL('https://en.wikipedia.org/w/api.php');
        langLinksUrl.searchParams.append('action', 'query');
        langLinksUrl.searchParams.append('titles', enTitle);
        langLinksUrl.searchParams.append('prop', 'langlinks');
        langLinksUrl.searchParams.append('lllang', 'te');
        langLinksUrl.searchParams.append('format', 'json');
        langLinksUrl.searchParams.append('origin', '*');
        
        const langResponse = await fetch(langLinksUrl.toString());
        const langData = await langResponse.json();
        
        const pages = langData.query?.pages || {};
        const page = Object.values(pages)[0] as any;
        
        if (page && page.langlinks && page.langlinks.length > 0) {
          // If we found a Telugu equivalent, search for that
          const teTitle = page.langlinks[0]['*'];
          
          const teUrl = new URL('https://te.wikipedia.org/w/api.php');
          teUrl.searchParams.append('action', 'query');
          teUrl.searchParams.append('list', 'search');
          teUrl.searchParams.append('srsearch', teTitle);
          teUrl.searchParams.append('format', 'json');
          teUrl.searchParams.append('origin', '*');
          
          const teResponse = await fetch(teUrl.toString());
          const teData = await teResponse.json();
          
          return teData.query?.search || [];
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error searching Wikipedia:', error);
    return [];
  }
};

// Get detailed content for a specific Wikipedia page
export const getWikipediaContent = async (
  pageId: number, 
  language: 'en' | 'te'
): Promise<WikipediaContent | null> => {
  try {
    const apiUrl = getApiUrlByLanguage(language);
    const url = new URL(apiUrl);
    
    url.searchParams.append('action', 'query');
    url.searchParams.append('pageids', pageId.toString());
    url.searchParams.append('prop', 'extracts|pageimages');
    url.searchParams.append('exintro', '1');
    url.searchParams.append('explaintext', '1');
    url.searchParams.append('pithumbsize', '300');
    url.searchParams.append('format', 'json');
    url.searchParams.append('origin', '*');
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (data.query && data.query.pages && data.query.pages[pageId]) {
      const page = data.query.pages[pageId];
      return {
        title: page.title,
        extract: page.extract,
        thumbnail: page.thumbnail,
        pageid: pageId
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Wikipedia content:', error);
    return null;
  }
};

// Get sections of a Wikipedia article
export const getWikipediaSections = async (
  pageId: number,
  language: 'en' | 'te'
): Promise<{ sections: any[] }> => {
  try {
    const apiUrl = getApiUrlByLanguage(language);
    const url = new URL(apiUrl);
    
    url.searchParams.append('action', 'parse');
    url.searchParams.append('pageid', pageId.toString());
    url.searchParams.append('prop', 'sections');
    url.searchParams.append('format', 'json');
    url.searchParams.append('origin', '*');
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    return {
      sections: data.parse?.sections || []
    };
  } catch (error) {
    console.error('Error fetching Wikipedia sections:', error);
    return { sections: [] };
  }
};

// Get the content of a specific section
export const getWikipediaSectionContent = async (
  pageId: number,
  sectionIndex: number,
  language: 'en' | 'te'
): Promise<{ content: string }> => {
  try {
    const apiUrl = getApiUrlByLanguage(language);
    const url = new URL(apiUrl);
    
    url.searchParams.append('action', 'parse');
    url.searchParams.append('pageid', pageId.toString());
    url.searchParams.append('section', sectionIndex.toString());
    url.searchParams.append('prop', 'text');
    url.searchParams.append('format', 'json');
    url.searchParams.append('origin', '*');
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    return {
      content: data.parse?.text['*'] || ''
    };
  } catch (error) {
    console.error('Error fetching section content:', error);
    return { content: '' };
  }
};
