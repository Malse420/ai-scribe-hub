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
    const { prompt, model, context } = await req.json();
    
    if (model === 'huggingface') {
      const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'));
      const response = await hf.textGeneration({
        model: 'codellama/CodeLlama-34b-Instruct-hf',
        inputs: `${context ? `Context: ${context}\n\n` : ''}${prompt}`,
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
    } else {
      // Default to OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant that helps with web development tasks.' },
            { role: 'user', content: `${context ? `Context: ${context}\n\n` : ''}${prompt}` }
          ],
        }),
      });

      const data = await response.json();
      return new Response(
        JSON.stringify({ result: data.choices[0].message.content }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in process-ai-query:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});