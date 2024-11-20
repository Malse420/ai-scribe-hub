import { toast } from "sonner";

export interface PageMetadata {
  title: string;
  description: string;
  url: string;
  scripts: string[];
  styles: string[];
}

export const analyzeDOMStructure = () => {
  const structure: Record<string, number> = {};
  const elements = document.querySelectorAll('*');
  
  elements.forEach(el => {
    const tag = el.tagName.toLowerCase();
    structure[tag] = (structure[tag] || 0) + 1;
  });
  
  return structure;
};

export const generateSelector = (description: string): string[] => {
  const selectors: string[] = [];
  const elements = document.querySelectorAll('*');
  
  elements.forEach(el => {
    // Basic heuristics for finding elements based on description
    const text = el.textContent?.toLowerCase() || '';
    const id = el.id?.toLowerCase() || '';
    const classes = Array.from(el.classList).join(' ').toLowerCase();
    
    if (
      text.includes(description.toLowerCase()) ||
      id.includes(description.toLowerCase()) ||
      classes.includes(description.toLowerCase())
    ) {
      // Generate multiple selector options
      if (el.id) selectors.push(`#${el.id}`);
      if (el.className) selectors.push(`.${el.className.split(' ').join('.')}`);
      
      // Generate unique selector path
      let path = '';
      let current = el as Element;
      while (current && current !== document.body) {
        const parent = current.parentElement;
        if (!parent) break;
        
        const index = Array.from(parent.children).indexOf(current) + 1;
        path = `> :nth-child(${index})${path ? ' ' + path : ''}`;
        current = parent;
      }
      if (path) selectors.push(`body ${path}`);
    }
  });
  
  return [...new Set(selectors)]; // Remove duplicates
};

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

export const findElementByDescription = (description: string): Element | null => {
  const selectors = generateSelector(description);
  for (const selector of selectors) {
    try {
      const element = document.querySelector(selector);
      if (element) return element;
    } catch (error) {
      console.warn(`Invalid selector: ${selector}`);
    }
  }
  return null;
};