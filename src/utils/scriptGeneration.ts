import { toast } from "sonner";

export interface ScriptTemplate {
  name: string;
  description: string;
  code: string;
}

export interface UserScript {
  id: string;
  name: string;
  description: string;
  code: string;
  created: string;
  modified: string;
}

const generateScriptId = () => Math.random().toString(36).substr(2, 9);

export const generateScript = (task: string, context: any): UserScript => {
  // This is a placeholder for the actual NLP-based script generation
  // In a real implementation, this would use AI to generate appropriate scripts
  const script: UserScript = {
    id: generateScriptId(),
    name: `Script for ${task}`,
    description: `Automatically generated script for: ${task}`,
    code: `// Generated script for: ${task}\n// Context: ${JSON.stringify(context)}\n\n// Your code here`,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  };

  return script;
};

export const saveScript = (script: UserScript): void => {
  try {
    const scripts = JSON.parse(localStorage.getItem('userScripts') || '[]');
    scripts.push(script);
    localStorage.setItem('userScripts', JSON.stringify(scripts));
    toast.success("Script saved successfully");
  } catch (error) {
    toast.error("Failed to save script");
    throw error;
  }
};

export const getScripts = (): UserScript[] => {
  return JSON.parse(localStorage.getItem('userScripts') || '[]');
};

export const deleteScript = (id: string): void => {
  try {
    const scripts = getScripts().filter(s => s.id !== id);
    localStorage.setItem('userScripts', JSON.stringify(scripts));
    toast.success("Script deleted successfully");
  } catch (error) {
    toast.error("Failed to delete script");
    throw error;
  }
};