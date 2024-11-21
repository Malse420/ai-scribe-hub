import { supabase } from "@/lib/supabase";
import { getApiKey } from "./apiKeys";

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

  const { data, error } = await supabase.functions.invoke('ai-model-handler', {
    body: { prompt, task, huggingFaceToken },
  });

  if (error) {
    console.error('Error calling AI model:', error);
    throw new Error('Failed to generate response');
  }

  return data as AIModelResponse;
};