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

export type ExportFormat = 'json' | 'csv' | 'xml';