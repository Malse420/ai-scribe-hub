import { supabase } from "@/lib/supabase";

interface AIModelResponse {
  result: string;
  model: string;
}

export const generateWithAI = async (
  prompt: string,
  task: 'code' | 'chat'
): Promise<AIModelResponse> => {
  const { data, error } = await supabase.functions.invoke('ai-model-handler', {
    body: { prompt, task },
  });

  if (error) {
    console.error('Error calling AI model:', error);
    throw new Error('Failed to generate response');
  }

  return data as AIModelResponse;
};