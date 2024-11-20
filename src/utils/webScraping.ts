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

export const scrapeData = async (config: ScrapingConfig): Promise<ScrapedData> => {
  try {
    const elements = Array.from(document.querySelectorAll(config.selector));
    let data = elements.map(el => {
      const result: Record<string, any> = {
        text: el.textContent?.trim(),
      };
      
      if (config.attributes) {
        config.attributes.forEach(attr => {
          result[attr] = el.getAttribute(attr);
        });
      }
      
      return result;
    });

    // Apply filters if specified
    if (config.filters) {
      data = data.filter(item => {
        return config.filters!.every(filter => {
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
    }

    // Handle pagination if configured
    if (config.pagination) {
      let currentPage = 1;
      let nextButton = document.querySelector(config.pagination.nextButton);
      
      while (nextButton && currentPage < config.pagination.maxPages) {
        (nextButton as HTMLElement).click();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for content to load
        
        const newElements = Array.from(document.querySelectorAll(config.selector));
        const newData = newElements.map(el => ({
          text: el.textContent?.trim(),
          ...(config.attributes && Object.fromEntries(
            config.attributes.map(attr => [attr, el.getAttribute(attr)])
          ))
        }));
        
        data = [...data, ...newData];
        currentPage++;
        nextButton = document.querySelector(config.pagination.nextButton);
      }
    }

    return {
      elements: data,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };
  } catch (error) {
    toast.error("Failed to scrape data");
    throw error;
  }
};

export const exportData = (data: ScrapedData, format: 'csv' | 'json' | 'xml'): string => {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'csv':
      const headers = Object.keys(data.elements[0] || {});
      const rows = data.elements.map(el => 
        headers.map(header => el[header]).join(',')
      );
      return [headers.join(','), ...rows].join('\n');
    case 'xml':
      const xmlElements = data.elements.map(el => 
        `<element>${
          Object.entries(el)
            .map(([key, value]) => `<${key}>${value}</${key}>`)
            .join('')
        }</element>`
      ).join('');
      return `<?xml version="1.0"?><data>${xmlElements}</data>`;
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
};