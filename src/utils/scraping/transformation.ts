import { ScrapingConfig } from './types';

export const transformData = (data: Record<string, any>[], transformation?: ScrapingConfig['transformation']) => {
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

export const applyFilters = (data: Record<string, any>[], filters?: ScrapingConfig['filters']) => {
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