interface AttributePattern {
  name: string;
  pattern: RegExp;
  weight: number;
}

export const findElementsByPattern = (patterns: AttributePattern[]): Element[] => {
  const elements = document.querySelectorAll('*');
  const matches = new Map<Element, number>();

  elements.forEach(element => {
    let score = 0;
    patterns.forEach(pattern => {
      const value = element.getAttribute(pattern.name);
      if (value && pattern.pattern.test(value)) {
        score += pattern.weight;
      }
    });
    if (score > 0) {
      matches.set(element, score);
    }
  });

  return Array.from(matches.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([element]) => element);
};

export const generateSmartSelector = (element: Element): string => {
  const uniqueAttributes = ['id', 'name', 'data-testid', 'data-cy', 'aria-label'];
  
  // Try unique attributes first
  for (const attr of uniqueAttributes) {
    const value = element.getAttribute(attr);
    if (value) {
      return `[${attr}="${value}"]`;
    }
  }

  // Try class combinations
  if (element.classList.length > 0) {
    const classSelector = '.' + Array.from(element.classList).join('.');
    if (document.querySelectorAll(classSelector).length === 1) {
      return classSelector;
    }
  }

  // Generate nth-child selector as fallback
  let current = element;
  const path = [];
  while (current.parentElement) {
    const parent = current.parentElement;
    const siblings = Array.from(parent.children);
    const index = siblings.indexOf(current) + 1;
    path.unshift(`> :nth-child(${index})`);
    current = parent;
  }
  
  return `body ${path.join(' ')}`;
};