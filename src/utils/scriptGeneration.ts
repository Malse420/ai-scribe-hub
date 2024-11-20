import { toast } from "sonner";
import { UserScript } from "@/types/script";
import { supabase } from "@/lib/supabase";

const generateScriptId = () => Math.random().toString(36).substr(2, 9);

export const generateScript = (task: string, context: any): UserScript => {
  const script: UserScript = {
    id: generateScriptId(),
    title: `Script for ${task}`,
    content: `// Generated script for: ${task}\n// Context: ${JSON.stringify(context)}\n\n// Your code here`,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return script;
};

export const saveScript = async (script: UserScript): Promise<void> => {
  try {
    const { error } = await supabase
      .from('userscripts')
      .upsert(script);
    
    if (error) throw error;
    toast.success("Script saved successfully");
  } catch (error) {
    toast.error("Failed to save script");
    throw error;
  }
};

export const deleteScript = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('userscripts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success("Script deleted successfully");
  } catch (error) {
    toast.error("Failed to delete script");
    throw error;
  }
};