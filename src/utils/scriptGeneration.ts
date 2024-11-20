import { toast } from "sonner";

export interface ScriptTemplate {
  name: string;
  description: string;
  code: string;
}

export interface UserScript {
  id: string;
  title: string;
  content: string;
  version: number;
  created_at?: string;
  updated_at?: string;
  last_accessed_at?: string;
  parent_version_id?: string;
  is_shared?: boolean;
  shared_with?: any[];
  last_editor?: string;
  collaborators?: any[];
}

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