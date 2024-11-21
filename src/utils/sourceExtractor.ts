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
      console.warn("Could not access stylesheet:", e);
    }
  });

  // Extract all JavaScript including external scripts
  const scripts = Array.from(document.scripts);
  const inlineScripts = scripts
    .filter(script => !script.src)
    .map(script => script.text)
    .join("\n\n");

  const externalScripts = scripts
    .filter(script => script.src)
    .map(script => script.src);

  return {
    html: formatCode(html, "html"),
    css: formatCode(css, "css"),
    javascript: formatCode(inlineScripts, "javascript"),
    externalScripts,
    url: window.location.href,
    title: document.title
  };
};

const formatCode = (code: string, language: string): string => {
  try {
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