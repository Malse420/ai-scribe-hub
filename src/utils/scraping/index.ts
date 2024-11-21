import { ScrapingConfig, ScrapedData } from './types';
import { validateData } from './validation';
import { transformData, applyFilters } from './transformation';
import { extractElementData, handlePagination } from './extraction';
import { toast } from 'sonner';

export * from './types';
export * from './export';

export const scrapeData = async (config: ScrapingConfig): Promise<ScrapedData> => {
  try {
    let allData: Record<string, any>[] = [];
    let currentPage = 1;
    let shouldContinue = true;
    
    const scrapeCurrentPage = () => {
      const elements = Array.from(document.querySelectorAll(config.selector));
      const pageData = elements
        .map(el => extractElementData(el, config))
        .filter(data => validateData(data, config.validation));
      allData = [...allData, ...pageData];

      if (config.pagination?.stopCondition) {
        try {
          shouldContinue = new Function('data', `return ${config.pagination.stopCondition}`)(pageData);
        } catch (error) {
          console.error('Stop condition error:', error);
          shouldContinue = false;
        }
      }
    };

    // Initial scrape
    scrapeCurrentPage();

    // Handle pagination
    while (await handlePagination(config, currentPage, shouldContinue)) {
      scrapeCurrentPage();
      currentPage++;
    }

    // Apply transformations and filters
    let processedData = transformData(allData, config.transformation);
    processedData = applyFilters(processedData, config.filters);

    return {
      elements: processedData,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      metadata: {
        totalPages: currentPage,
        totalElements: processedData.length,
        config
      }
    };
  } catch (error) {
    console.error('Scraping error:', error);
    toast.error("Failed to scrape data");
    throw error;
  }
};