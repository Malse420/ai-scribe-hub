/// <reference types="chrome" />

// Create and inject the mobile sidebar
const createMobileSidebar = () => {
  const sidebar = document.createElement('div');
  sidebar.id = 'ai-scribe-mobile-sidebar';
  sidebar.innerHTML = `
    <div class="ai-scribe-handle">
      <span class="ai-scribe-handle-icon">⚡</span>
    </div>
    <div class="ai-scribe-content">
      <div class="ai-scribe-header">
        <span class="ai-scribe-version">AI Scribe v9.5</span>
        <button class="ai-scribe-close">×</button>
      </div>
      <nav class="ai-scribe-nav">
        <button class="ai-scribe-nav-item" data-action="capture">
          <span class="ai-scribe-icon">📸</span>
          Capture view
        </button>
        <button class="ai-scribe-nav-item" data-action="search">
          <span class="ai-scribe-icon">🔍</span>
          Search the web
        </button>
        <button class="ai-scribe-nav-item" data-action="explain">
          <span class="ai-scribe-icon">🤖</span>
          Explain
        </button>
        <button class="ai-scribe-nav-item" data-action="ask">
          <span class="ai-scribe-icon">💭</span>
          Ask page
        </button>
        <button class="ai-scribe-nav-item" data-action="summarize">
          <span class="ai-scribe-icon">✨</span>
          Summarize
        </button>
        <button class="ai-scribe-nav-item" data-action="extract">
          <span class="ai-scribe-icon">📊</span>
          Extract data
        </button>
        <button class="ai-scribe-nav-item" data-action="repurpose">
          <span class="ai-scribe-icon">📝</span>
          Repurpose page
        </button>
        <button class="ai-scribe-nav-item" data-action="rewrite">
          <span class="ai-scribe-icon">✏️</span>
          Rewrite
        </button>
        <button class="ai-scribe-nav-item" data-action="reply">
          <span class="ai-scribe-icon">✉️</span>
          Write a reply
        </button>
      </nav>
      <div class="ai-scribe-footer">
        <input type="text" class="ai-scribe-input" placeholder="Type a question... Press / for commands, {{ for params." />
      </div>
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
      width: 320px;
      background: #1a1b1e;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
      z-index: 2147483647;
      transform: translateX(280px);
      transition: transform 0.3s ease;
      font-family: system-ui, -apple-system, sans-serif;
      color: #fff;
    }

    #ai-scribe-mobile-sidebar:hover,
    #ai-scribe-mobile-sidebar.expanded {
      transform: translateX(0);
    }

    .ai-scribe-handle {
      position: absolute;
      left: -40px;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      background: #2d2e32;
      border-radius: 8px 0 0 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }

    .ai-scribe-handle-icon {
      font-size: 20px;
    }

    .ai-scribe-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #1a1b1e;
    }

    .ai-scribe-header {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #2d2e32;
    }

    .ai-scribe-version {
      font-size: 14px;
      font-weight: 500;
    }

    .ai-scribe-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
    }

    .ai-scribe-nav {
      flex: 1;
      padding: 8px;
      overflow-y: auto;
    }

    .ai-scribe-nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px;
      border: none;
      background: none;
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      text-align: left;
      border-radius: 6px;
      transition: background-color 0.2s;
    }

    .ai-scribe-nav-item:hover {
      background: #2d2e32;
    }

    .ai-scribe-icon {
      font-size: 18px;
    }

    .ai-scribe-footer {
      padding: 16px;
      border-top: 1px solid #2d2e32;
    }

    .ai-scribe-input {
      width: 100%;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #2d2e32;
      background: #2d2e32;
      color: #fff;
      font-size: 14px;
    }

    .ai-scribe-input::placeholder {
      color: #9ca3af;
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
