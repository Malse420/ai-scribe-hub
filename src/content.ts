/// <reference types="chrome" />

import { sidebarStyles } from "./styles/sidebarStyles";
import { sidebarTemplate } from "./templates/sidebarTemplate";
import { DOMObserver, DOMChangeEvent } from "./utils/domObserver";

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
      chrome.runtime.sendMessage({ type: 'NAVIGATE', action })
        .catch(error => console.error('Navigation error:', error));
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

// Initialize DOM observer with throttled callback
const domObserver = new DOMObserver((event: DOMChangeEvent) => {
  // Log significant DOM changes
  if (event.type === 'childList' && (event.addedNodes?.length || event.removedNodes?.length)) {
    console.debug('DOM structure changed:', {
      timestamp: event.timestamp,
      target: event.target,
      addedNodes: event.addedNodes?.length || 0,
      removedNodes: event.removedNodes?.length || 0
    });
  }
});

// Start observing
domObserver.observe();

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