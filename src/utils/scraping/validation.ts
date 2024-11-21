import { ScrapingConfig } from './types';

export const validateData = (data: Record<string, any>, validation?: ScrapingConfig['validation']) => {
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