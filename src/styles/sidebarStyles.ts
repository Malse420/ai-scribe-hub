export const sidebarStyles = `
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
`;