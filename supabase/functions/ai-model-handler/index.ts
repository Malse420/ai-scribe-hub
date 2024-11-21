import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, task, huggingFaceToken } = await req.json()

    if (!huggingFaceToken) {
      throw new Error('Hugging Face token is required')
    }

    const hf = new HfInference(huggingFaceToken)
    let response

    switch (task) {
      case 'code':
        response = await hf.textGeneration({
          model: 'codellama/CodeLlama-34b-Instruct-hf',
          inputs: prompt,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.7,
            top_p: 0.95,
          },
        })
        break

      case 'chat':
        response = await hf.textGeneration({
          model: 'Qwen/Qwen-14B-Chat',
          inputs: prompt,
          parameters: {
            max_new_tokens: 256,
            temperature: 0.8,
            top_p: 0.9,
          },
        })
        break

      default:
        throw new Error('Invalid task type specified')
    }

    return new Response(
      JSON.stringify({ 
        result: response.generated_text,
        model: task === 'code' ? 'CodeLlama' : 'Qwen',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in ai-model-handler:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})