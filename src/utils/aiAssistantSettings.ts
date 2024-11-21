interface AIAssistantSettings {
  systemPrompt: string;
  includeHtmlSource: boolean;
  includeInlineScripts: boolean;
  includeExternalScripts: boolean;
  includePageMetadata: boolean;
  defaultModel: string;
}

const DEFAULT_SETTINGS: AIAssistantSettings = {
  systemPrompt: "You are a helpful AI assistant that helps users with web development tasks.",
  includeHtmlSource: true,
  includeInlineScripts: true,
  includeExternalScripts: false,
  includePageMetadata: true,
  defaultModel: "gpt-4o-mini"
};

export const getAIAssistantSettings = (): AIAssistantSettings => {
  const savedSettings = localStorage.getItem('aiAssistantSettings');
  if (savedSettings) {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
  }
  return DEFAULT_SETTINGS;
};

export const saveAIAssistantSettings = (settings: AIAssistantSettings): void => {
  localStorage.setItem('aiAssistantSettings', JSON.stringify(settings));
};