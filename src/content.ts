/// <reference types="chrome" />

import { sidebarStyles } from "./styles/sidebarStyles";
import { sidebarTemplate } from "./templates/sidebarTemplate";

// Create and inject the sidebar
const createSidebar = () => {
  const sidebar = document.createElement('div');
  sidebar.id = 'ai-scribe-mobile-sidebar';
  sidebar.innerHTML = sidebarTemplate;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = sidebarStyles;
  document.head.appendChild(style);
  document.body.appendChild(sidebar);

  // Handle click events
  sidebar.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const action = target.closest('[data-action]')?.getAttribute('data-action');
    
    if (action) {
      chrome.runtime.sendMessage({ type: 'NAVIGATE', action });
    }
  });

  // Toggle expanded state
  const handle = sidebar.querySelector('.ai-scribe-handle');
  const closeBtn = sidebar.querySelector('.ai-scribe-close');
  
  handle?.addEventListener('click', () => {
    sidebar.classList.toggle('expanded');
  });

  closeBtn?.addEventListener('click', () => {
    sidebar.classList.remove('expanded');
  });
};

// Initialize the sidebar when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createSidebar);
} else {
  createSidebar();
}

// DOM Observer for page changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      analyzeDOMChanges(mutation.target as Element);
    }
  });
});

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
    };
    sendResponse(pageInfo);
  }
  return true;
});
