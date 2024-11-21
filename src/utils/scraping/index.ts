import { ScrapingConfig, ScrapedData } from './types';
import { validateData } from './validation';
import { transformData, applyFilters } from './transformation';
import { extractElementData } from './extraction';
import { createRateLimiter } from './rateLimit';
import { withRetry } from './retryMechanism';
import { scrapeRecursively } from './recursiveScraping';
import { findElementsByPattern, generateSmartSelector } from './smartDetection';
import { toast } from 'sonner';

export * from './types';
export * from './export';

const createScrapeOperation = (config: ScrapingConfig) => {
  return async () => {
    const elements = Array.from(document.querySelectorAll(config.selector));
    const pageData = elements
      .map(el => extractElementData(el, config))
      .filter(data => validateData(data, config.validation));

    if (config.recursive?.enabled && config.recursive.childSelector) {
      const recursiveData = await Promise.all(
        elements.map(el => scrapeRecursively(el, config as any))
      );
      return recursiveData.flat();
    }

    return pageData;
  };
};

export const scrapeData = async (config: ScrapingConfig): Promise<ScrapedData> => {
  try {
    let allData: Record<string, any>[] = [];
    let currentPage = 1;
    let shouldContinue = true;

    const rateLimiter = config.rateLimit?.enabled
      ? createRateLimiter({
          requestsPerMinute: config.rateLimit.requestsPerMinute,
          delayBetweenRequests: config.rateLimit.delayBetweenRequests,
          maxConcurrent: config.rateLimit.maxConcurrent || 1
        })
      : null;

    const scrapeWithConfig = async () => {
      const operation = createScrapeOperation(config);

      if (config.retry?.enabled) {
        return withRetry(operation, {
          maxRetries: config.retry.maxRetries,
          backoffFactor: config.retry.backoffFactor || 2,
          initialDelay: config.retry.initialDelay,
          maxDelay: config.retry.maxDelay || 30000
        });
      }

      return operation();
    };

    // Initial scrape
    const executeScrapingOperation = async () => {
      const pageData = await (rateLimiter
        ? rateLimiter.execute(scrapeWithConfig)
        : scrapeWithConfig());

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

    await executeScrapingOperation();

    // Handle pagination
    while (
      shouldContinue &&
      config.pagination?.nextButton &&
      currentPage < (config.pagination.maxPages || 1)
    ) {
      const nextButton = document.querySelector(config.pagination.nextButton) as HTMLElement;
      if (!nextButton) break;

      nextButton.click();
      await new Promise(resolve => 
        setTimeout(resolve, config.pagination.waitTime || 1000)
      );
      
      await executeScrapingOperation();
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