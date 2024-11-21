export type SelectorType = 'css' | 'xpath';

export const generateXPathSelector = (element: Element): string => {
  if (!element || !element.parentNode) return '';
  
  let path = '';
  let current = element;
  
  while (current !== document.documentElement) {
    let index = 1;
    let sibling = current.previousElementSibling;
    
    while (sibling) {
      if (sibling.nodeName === current.nodeName) {
        index++;
      }
      sibling = sibling.previousElementSibling;
    }
    
    const nodeName = current.nodeName.toLowerCase();
    path = `/${nodeName}[${index}]${path}`;
    
    if (!current.parentElement) break;
    current = current.parentElement;
  }
  
  return `/html${path}`;
};

export const findElementsByXPath = (xpath: string): Element[] => {
  const elements: Element[] = [];
  try {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    
    for (let i = 0; i < result.snapshotLength; i++) {
      const element = result.snapshotItem(i) as Element;
      if (element) elements.push(element);
    }
  } catch (error) {
    console.error('XPath evaluation error:', error);
  }
  return elements;
};