/// <reference types="chrome" />

// Create and inject the mobile sidebar
const createMobileSidebar = () => {
  const sidebar = document.createElement('div');
  sidebar.id = 'ai-scribe-mobile-sidebar';
  sidebar.innerHTML = `
    <div class="ai-scribe-handle"></div>
    <div class="ai-scribe-content">
      <div class="ai-scribe-header">AI Scribe Hub</div>
      <nav class="ai-scribe-nav">
        <button class="ai-scribe-nav-item" data-action="chat">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Chat
        </button>
        <button class="ai-scribe-nav-item" data-action="devtools">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
            <path d="M20 7h-7m7 10h-7M8 7l-4 5 4 5"></path>
          </svg>
          Dev Tools
        </button>
        <button class="ai-scribe-nav-item" data-action="settings">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Settings
        </button>
      </nav>
    </div>
  `;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #ai-scribe-mobile-sidebar {
      position: fixed;
      right: 0;
      top: 0;
      bottom: 0;
      width: 280px;
      background: white;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
      z-index: 2147483647;
      transform: translateX(240px);
      transition: transform 0.3s ease;
      font-family: system-ui, -apple-system, sans-serif;
    }

    #ai-scribe-mobile-sidebar:hover,
    #ai-scribe-mobile-sidebar.expanded {
      transform: translateX(0);
    }

    .ai-scribe-handle {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 40px;
      background: #0070F3;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      font-weight: 500;
      font-size: 14px;
      user-select: none;
    }

    .ai-scribe-handle::before {
      content: "AI Scribe Hub";
    }

    .ai-scribe-content {
      position: absolute;
      left: 40px;
      right: 0;
      top: 0;
      bottom: 0;
      overflow-y: auto;
      background: white;
    }

    .ai-scribe-header {
      padding: 16px;
      font-size: 18px;
      font-weight: 600;
      border-bottom: 1px solid #eee;
    }

    .ai-scribe-nav {
      padding: 8px;
    }

    .ai-scribe-nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px;
      border: none;
      background: none;
      color: #333;
      cursor: pointer;
      font-size: 14px;
      text-align: left;
      border-radius: 6px;
      transition: background-color 0.2s;
    }

    .ai-scribe-nav-item:hover {
      background: #f5f5f5;
    }

    .ai-scribe-nav-item svg {
      flex-shrink: 0;
    }

    @media (min-width: 1024px) {
      #ai-scribe-mobile-sidebar {
        display: none;
      }
    }
  `;

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
  handle?.addEventListener('click', () => {
    sidebar.classList.toggle('expanded');
  });
};

// Initialize the sidebar when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createMobileSidebar);
} else {
  createMobileSidebar();
}

// Keep existing mutation observer code
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
      // Add more page information as needed
    };
    sendResponse(pageInfo);
  }
  return true;
});
