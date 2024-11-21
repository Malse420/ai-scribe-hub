interface AIAssistantSettings {
  systemPrompt: string;
  includeHtmlSource: boolean;
  includeInlineScripts: boolean;
  includeExternalScripts: boolean;
  includePageMetadata: boolean;
}

const DEFAULT_SYSTEM_PROMPT = "You are a helpful AI assistant that helps users understand and modify web pages.";

export const getAIAssistantSettings = (): AIAssistantSettings => {
  const stored = localStorage.getItem('ai_assistant_settings');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    includeHtmlSource: true,
    includeInlineScripts: true,
    includeExternalScripts: true,
    includePageMetadata: true,
  };
};

export const saveAIAssistantSettings = (settings: AIAssistantSettings) => {
  localStorage.setItem('ai_assistant_settings', JSON.stringify(settings));
};