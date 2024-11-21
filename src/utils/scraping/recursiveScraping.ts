import { ScrapingConfig } from './types';
import { extractElementData } from './extraction';

interface RecursiveConfig extends ScrapingConfig {
  maxDepth?: number;
  childSelector?: string;
  aggregateResults?: boolean;
}

export const scrapeRecursively = async (
  element: Element,
  config: RecursiveConfig,
  depth = 0
): Promise<Record<string, any>[]> => {
  if (config.maxDepth && depth >= config.maxDepth) {
    return [];
  }

  const result = extractElementData(element, config);
  const results = [result];

  if (config.childSelector) {
    const children = Array.from(element.querySelectorAll(config.childSelector));
    for (const child of children) {
      const childResults = await scrapeRecursively(child, config, depth + 1);
      if (config.aggregateResults) {
        result.children = childResults;
      } else {
        results.push(...childResults);
      }
    }
  }

  return results;
};