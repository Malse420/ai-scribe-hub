import { toast } from "sonner";

export interface ScrapingConfig {
  selector: string;
  attributes?: string[];
  pagination?: {
    nextButton: string;
    maxPages: number;
  };
  filters?: {
    field: string;
    operator: 'equals' | 'contains' | 'greater' | 'less';
    value: string | number;
  }[];
}

export interface ScrapedData {
  elements: Record<string, any>[];
  timestamp: string;
  url: string;
  metadata?: Record<string, any>;
}

const extractElementData = (element: Element, attributes?: string[]) => {
  const result: Record<string, any> = {
    text: element.textContent?.trim(),
  };
  
  if (attributes) {
    attributes.forEach(attr => {
      result[attr] = element.getAttribute(attr);
    });
  }
  
  return result;
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
    
    const scrapeCurrentPage = () => {
      const elements = Array.from(document.querySelectorAll(config.selector));
      const pageData = elements.map(el => extractElementData(el, config.attributes));
      allData = [...allData, ...pageData];
    };

    // Initial scrape
    scrapeCurrentPage();

    // Handle pagination if configured
    if (config.pagination?.nextButton && config.pagination.maxPages > 1) {
      while (currentPage < config.pagination.maxPages) {
        const nextButton = document.querySelector(config.pagination.nextButton) as HTMLElement;
        if (!nextButton) break;

        nextButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for content to load
        scrapeCurrentPage();
        currentPage++;
      }
    }

    // Apply filters
    const filteredData = applyFilters(allData, config.filters);

    return {
      elements: filteredData,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      metadata: {
        totalPages: currentPage,
        totalElements: filteredData.length,
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