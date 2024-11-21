import { supabase } from "@/lib/supabase";
import { getApiKey } from "./apiKeys";
import { extractPageSource } from "./sourceExtractor";

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

  // Extract page source and context
  const pageContext = extractPageSource();
  const contextPrompt = `
Current webpage context:
URL: ${pageContext.url}
Title: ${pageContext.title}

HTML Structure:
${pageContext.html}

Active Scripts:
${pageContext.javascript}

External Scripts:
${pageContext.externalScripts.join('\n')}

User Query:
${prompt}
`;

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