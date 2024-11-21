type ApiProvider = "openai" | "anthropic" | "google" | "huggingface";

export const getApiKey = (provider: ApiProvider): string | null => {
  return localStorage.getItem(`${provider}_key`);
};

export const setApiKey = (provider: ApiProvider, key: string): void => {
  if (key) {
    localStorage.setItem(`${provider}_key`, key);
  } else {
    localStorage.removeItem(`${provider}_key`);
  }
};

export const hasValidApiKey = (provider: ApiProvider): boolean => {
  const key = getApiKey(provider);
  return key !== null && key.length > 0;
};

export const getPreferredProvider = (): ApiProvider => {
  if (hasValidApiKey("openai")) return "openai";
  if (hasValidApiKey("anthropic")) return "anthropic";
  if (hasValidApiKey("google")) return "google";
  if (hasValidApiKey("huggingface")) return "huggingface";
  return "openai"; // Default fallback
};