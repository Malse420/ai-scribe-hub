export const sidebarTemplate = `
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