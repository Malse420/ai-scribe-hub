export const findElementByDescription = (description: string): HTMLElement[] => {
  const allElements = document.querySelectorAll("*");
  const matches: HTMLElement[] = [];
  const keywords = description.toLowerCase().split(" ");

  Array.from(allElements).forEach((element) => {
    const el = element as HTMLElement;
    const text = el.innerText?.toLowerCase() || "";
    const id = el.id?.toLowerCase() || "";
    const classes = Array.from(el.classList).join(" ").toLowerCase();
    const attributes = Array.from(el.attributes)
      .map((attr) => `${attr.name}="${attr.value}"`)
      .join(" ")
      .toLowerCase();

    const relevanceScore = keywords.reduce((score, keyword) => {
      if (text.includes(keyword)) score += 3;
      if (id.includes(keyword)) score += 2;
      if (classes.includes(keyword)) score += 1;
      if (attributes.includes(keyword)) score += 1;
      return score;
    }, 0);

    if (relevanceScore > 0) {
      matches.push(el);
    }
  });

  return matches.sort((a, b) => {
    const aScore = calculateElementScore(a);
    const bScore = calculateElementScore(b);
    return bScore - aScore;
  });
};

const calculateElementScore = (element: HTMLElement): number => {
  let score = 0;
  
  // Prefer elements with ID
  if (element.id) score += 5;
  
  // Prefer elements with classes
  score += element.classList.length;
  
  // Prefer elements with text content
  if (element.innerText?.trim()) score += 3;
  
  // Prefer elements that are interactive
  if (element instanceof HTMLButtonElement || 
      element instanceof HTMLAnchorElement ||
      element instanceof HTMLInputElement) {
    score += 2;
  }
  
  return score;
};

export const generateSelector = (element: HTMLElement): string[] => {
  const selectors: string[] = [];
  
  // ID selector
  if (element.id) {
    selectors.push(`#${element.id}`);
  }
  
  // Class selector
  if (element.classList.length > 0) {
    selectors.push(`.${Array.from(element.classList).join(".")}`);
  }
  
  // Attribute selectors
  Array.from(element.attributes).forEach((attr) => {
    if (attr.name !== "class" && attr.name !== "id") {
      selectors.push(`[${attr.name}="${attr.value}"]`);
    }
  });
  
  // Position selector
  const parent = element.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children);
    const index = siblings.indexOf(element);
    selectors.push(`${element.tagName.toLowerCase()}:nth-child(${index + 1})`);
  }
  
  return selectors;
};