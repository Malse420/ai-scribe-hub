export const extractPageSource = () => {
  const html = document.documentElement.outerHTML;
  
  // Extract all CSS
  const styleSheets = Array.from(document.styleSheets);
  let css = "";
  
  styleSheets.forEach(sheet => {
    try {
      const rules = Array.from(sheet.cssRules);
      css += rules.map(rule => rule.cssText).join("\n");
    } catch (e) {
      // Skip external stylesheets due to CORS
      console.warn("Could not access stylesheet:", e);
    }
  });

  // Extract all JavaScript
  const scripts = Array.from(document.scripts);
  const javascript = scripts
    .filter(script => !script.src) // Only inline scripts
    .map(script => script.text)
    .join("\n\n");

  return {
    html: formatCode(html, "html"),
    css: formatCode(css, "css"),
    javascript: formatCode(javascript, "javascript")
  };
};

const formatCode = (code: string, language: string): string => {
  try {
    // Basic formatting - you could add a proper formatter library if needed
    return code
      .split("\n")
      .map(line => line.trim())
      .filter(line => line)
      .join("\n");
  } catch (e) {
    console.error("Error formatting code:", e);
    return code;
  }
};