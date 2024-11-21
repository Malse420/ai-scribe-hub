import { ScrapingConfig } from './types';

export const extractElementData = (element: Element, config: ScrapingConfig) => {
  const result: Record<string, any> = {
    text: element.textContent?.trim(),
  };
  
  if (config.attributes) {
    config.attributes.forEach(attr => {
      result[attr] = element.getAttribute(attr);
    });
  }

  if (config.dynamicSelectors) {
    config.dynamicSelectors.childSelectors.forEach(({ name, selector, attribute }) => {
      const childElement = element.querySelector(selector);
      result[name] = attribute 
        ? childElement?.getAttribute(attribute)
        : childElement?.textContent?.trim();
    });
  }
  
  return result;
};

export const handlePagination = async (
  config: ScrapingConfig,
  currentPage: number,
  shouldContinue: boolean
): Promise<boolean> => {
  if (!config.pagination?.nextButton || currentPage >= (config.pagination.maxPages || 1)) {
    return false;
  }

  const nextButton = document.querySelector(config.pagination.nextButton) as HTMLElement;
  if (!nextButton || !shouldContinue) {
    return false;
  }

  nextButton.click();
  await new Promise(resolve => 
    setTimeout(resolve, config.pagination.waitTime || 1000)
  );
  return true;
};