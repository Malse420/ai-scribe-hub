import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context, task } = await req.json();
    const huggingFaceToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

    if (!huggingFaceToken) {
      throw new Error('Hugging Face token is required');
    }

    const hf = new HfInference(huggingFaceToken);
    let prompt = '';

    switch (task) {
      case 'selector':
        prompt = `Given this description: "${query}", generate a CSS selector. Context: ${context}`;
        break;
      case 'explain':
        prompt = `Explain this HTML element in simple terms: ${query}`;
        break;
      default:
        prompt = query;
    }

    const response = await hf.textGeneration({
      model: 'codellama/CodeLlama-34b-Instruct-hf',
      inputs: prompt,
      parameters: {
        max_new_tokens: 512,
        temperature: 0.7,
        top_p: 0.95,
      },
    });

    return new Response(
      JSON.stringify({ result: response.generated_text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in process-nlp-query function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});