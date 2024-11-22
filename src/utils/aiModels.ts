import { supabase } from "@/lib/supabase";
import { getApiKey } from "./apiKeys";
import { extractPageSource } from "./sourceExtractor";
import { getAIAssistantSettings } from "./aiAssistantSettings";

interface Message {
  role: string;
  content: string;
  timestamp?: number;
  pageContext?: {
    url: string;
    title: string;
    metadata: Record<string, any>;
  };
}

interface AIModelResponse {
  result: string;
  model: string;
}

interface GenerateOptions {
  messages?: Message[];
  pageContext?: {
    url: string;
    title: string;
    metadata: Record<string, any>;
  };
  contextMemory?: Record<string, any>;
}

export const generateWithAI = async (
  prompt: string,
  task: 'code' | 'chat',
  options?: GenerateOptions
): Promise<AIModelResponse> => {
  const huggingFaceToken = getApiKey("huggingface");
  
  if (!huggingFaceToken) {
    throw new Error('Hugging Face API key is required');
  }

  const settings = getAIAssistantSettings();
  const pageContext = options?.pageContext || extractPageSource();

  let contextPrompt = `${settings.systemPrompt}\n\n`;

  if (settings.includePageMetadata) {
    contextPrompt += `Current webpage context:
URL: ${pageContext.url}
Title: ${pageContext.title}\n\n`;
  }

  if (options?.contextMemory) {
    contextPrompt += `Previous interactions context:
${JSON.stringify(options.contextMemory, null, 2)}\n\n`;
  }

  if (options?.messages && options.messages.length > 0) {
    contextPrompt += `Conversation history:
${options.messages.map(m => `${m.role}: ${m.content}`).join('\n')}\n\n`;
  }

  if (settings.includeHtmlSource) {
    contextPrompt += `HTML Structure:
${pageContext.html}\n\n`;
  }

  contextPrompt += `User Query:
${prompt}`;

  const { data, error } = await supabase.functions.invoke('ai-model-handler', {
    body: { 
      prompt: contextPrompt,
      task,
      huggingFaceToken,
      options
    },
  });

  if (error) {
    console.error('Error calling AI model:', error);
    throw new Error('Failed to generate response');
  }

  return data as AIModelResponse;
};