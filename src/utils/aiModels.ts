import { supabase } from "@/lib/supabase";
import { getApiKey } from "./apiKeys";
import { extractPageSource } from "./sourceExtractor";
import { getAIAssistantSettings } from "./aiAssistantSettings";

interface AIModelResponse {
  result: string;
  model: string;
}

export const generateWithAI = async (
  prompt: string,
  task: 'code' | 'chat'
): Promise<AIModelResponse> => {
  const huggingFaceToken = getApiKey("huggingface");
  
  if (!huggingFaceToken) {
    throw new Error('Hugging Face API key is required');
  }

  const settings = getAIAssistantSettings();
  const pageContext = extractPageSource();

  let contextPrompt = `${settings.systemPrompt}\n\n`;

  if (settings.includePageMetadata) {
    contextPrompt += `Current webpage context:
URL: ${pageContext.url}
Title: ${pageContext.title}\n\n`;
  }

  if (settings.includeHtmlSource) {
    contextPrompt += `HTML Structure:
${pageContext.html}\n\n`;
  }

  if (settings.includeInlineScripts) {
    contextPrompt += `Active Scripts:
${pageContext.javascript}\n\n`;
  }

  if (settings.includeExternalScripts) {
    contextPrompt += `External Scripts:
${pageContext.externalScripts.join('\n')}\n\n`;
  }

  contextPrompt += `User Query:
${prompt}`;

  const { data, error } = await supabase.functions.invoke('ai-model-handler', {
    body: { 
      prompt: contextPrompt,
      task,
      huggingFaceToken
    },
  });

  if (error) {
    console.error('Error calling AI model:', error);
    throw new Error('Failed to generate response');
  }

  return data as AIModelResponse;
};