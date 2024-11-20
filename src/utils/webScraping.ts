import { toast } from "sonner";

export interface ScrapingConfig {
  selector: string;
  attributes?: string[];
  pagination?: {
    nextButton: string;
    maxPages: number;
  };
}

export interface ScrapedData {
  elements: Record<string, any>[];
  timestamp: string;
  url: string;
}

export const scrapeData = async (config: ScrapingConfig): Promise<ScrapedData> => {
  try {
    const elements = Array.from(document.querySelectorAll(config.selector));
    const data = elements.map(el => {
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
      // Basic XML implementation
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