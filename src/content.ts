/// <reference types="chrome"/>

// Listen for DOM mutations to handle dynamic content
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      // Handle DOM changes here
      analyzeDOMChanges(mutation.target as Element);
    }
  });
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Analyze DOM changes and send relevant data to the extension
function analyzeDOMChanges(element: Element) {
  // Implementation will be added based on specific requirements
  console.log("DOM changed:", element);
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PAGE_INFO") {
    const pageInfo = {
      url: window.location.href,
      title: document.title,
      // Add more page information as needed
    };
    sendResponse(pageInfo);
  }
  return true;
});