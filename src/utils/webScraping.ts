import { toast } from "sonner";

export interface ScrapingConfig {
  selector: string;
  attributes?: string[];
  pagination?: {
    nextButton: string;
    maxPages: number;
    waitTime?: number;
    stopCondition?: string;
  };
  filters?: {
    field: string;
    operator: 'equals' | 'contains' | 'greater' | 'less';
    value: string | number;
  }[];
  transformation?: {
    type: 'map' | 'filter' | 'reduce';
    function: string;
  };
  dynamicSelectors?: {
    parentSelector: string;
    childSelectors: {
      name: string;
      selector: string;
      attribute?: string;
    }[];
  };
  validation?: {
    required?: string[];
    format?: Record<string, string>;
    custom?: string;
  };
}

export interface ScrapedData {
  elements: Record<string, any>[];
  timestamp: string;
  url: string;
  metadata?: Record<string, any>;
}

const extractElementData = (element: Element, config: ScrapingConfig) => {
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

const validateData = (data: Record<string, any>, validation?: ScrapingConfig['validation']) => {
  if (!validation) return true;

  if (validation.required) {
    const missingFields = validation.required.filter(field => !data[field]);
    if (missingFields.length > 0) {
      console.warn(`Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }
  }

  if (validation.format) {
    for (const [field, format] of Object.entries(validation.format)) {
      if (data[field] && !new RegExp(format).test(data[field])) {
        console.warn(`Field ${field} does not match required format`);
        return false;
      }
    }
  }

  if (validation.custom) {
    try {
      return new Function('data', `return ${validation.custom}`)(data);
    } catch (error) {
      console.error('Custom validation error:', error);
      return false;
    }
  }

  return true;
};

const transformData = (data: Record<string, any>[], transformation?: ScrapingConfig['transformation']) => {
  if (!transformation) return data;

  try {
    const fn = new Function('data', `return ${transformation.function}`);
    switch (transformation.type) {
      case 'map':
        return data.map(item => fn(item));
      case 'filter':
        return data.filter(item => fn(item));
      case 'reduce':
        return [fn(data)];
      default:
        return data;
    }
  } catch (error) {
    console.error('Transformation error:', error);
    return data;
  }
};

const applyFilters = (data: Record<string, any>[], filters?: ScrapingConfig['filters']) => {
  if (!filters || filters.length === 0) return data;
  
  return data.filter(item => {
    return filters.every(filter => {
      const value = item[filter.field];
      switch (filter.operator) {
        case 'equals':
          return value === filter.value;
        case 'contains':
          return String(value).includes(String(filter.value));
        case 'greater':
          return Number(value) > Number(filter.value);
        case 'less':
          return Number(value) < Number(filter.value);
        default:
          return true;
      }
    });
  });
};

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

    // Handle pagination if configured
    if (config.pagination?.nextButton && config.pagination.maxPages > 1) {
      while (currentPage < config.pagination.maxPages && shouldContinue) {
        const nextButton = document.querySelector(config.pagination.nextButton) as HTMLElement;
        if (!nextButton) break;

        nextButton.click();
        await new Promise(resolve => 
          setTimeout(resolve, config.pagination?.waitTime || 1000)
        );
        scrapeCurrentPage();
        currentPage++;
      }
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

export const exportData = (data: ScrapedData, format: 'csv' | 'json' | 'xml'): string => {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    
    case 'csv': {
      const headers = Object.keys(data.elements[0] || {});
      const rows = data.elements.map(el => 
        headers.map(header => {
          const value = el[header];
          // Handle values that might contain commas
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"`
            : value;
        }).join(',')
      );
      return [headers.join(','), ...rows].join('\n');
    }
    
    case 'xml': {
      const metadata = `
        <metadata>
          <timestamp>${data.timestamp}</timestamp>
          <url>${data.url}</url>
          <total_elements>${data.elements.length}</total_elements>
        </metadata>
      `;
      
      const elements = data.elements.map(el => 
        `<element>${
          Object.entries(el)
            .map(([key, value]) => `<${key}>${value}</${key}>`)
            .join('')
        }</element>`
      ).join('\n');
      
      return `<?xml version="1.0" encoding="UTF-8"?>
<data>
  ${metadata}
  <elements>
    ${elements}
  </elements>
</data>`;
    }
    
    default:
      throw new Error('Unsupported format');
  }
};

export const downloadData = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success(`Downloaded ${filename}`);
};