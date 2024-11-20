export interface PageMetadata {
  title: string;
  description: string;
  url: string;
  scripts: string[];
  styles: string[];
}

export const getPageMetadata = (): PageMetadata => {
  const scripts = Array.from(document.getElementsByTagName('script')).map(s => s.src);
  const styles = Array.from(document.getElementsByTagName('link'))
    .filter(l => l.rel === 'stylesheet')
    .map(l => l.href);

  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    url: window.location.href,
    scripts,
    styles,
  };
};

export const generateSelector = (description: string): string[] => {
  // This is a placeholder for the ML-based selector generation
  // In a real implementation, this would use NLP to analyze the description
  // and generate appropriate selectors
  return [
    'button.primary',
    'button#main-button',
    'button[type="submit"]'
  ];
};

export const analyzeDOMStructure = () => {
  const structure: Record<string, number> = {};
  const elements = document.querySelectorAll('*');
  
  elements.forEach(el => {
    const tag = el.tagName.toLowerCase();
    structure[tag] = (structure[tag] || 0) + 1;
  });
  
  return structure;
};