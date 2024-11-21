import React, { createContext, useContext, useState, useCallback } from 'react';
import { generateWithAI } from '@/utils/aiModels';
import { toast } from 'sonner';
import { getAIAssistantSettings } from '@/utils/aiAssistantSettings';

interface AIAssistantContextType {
  processQuery: (query: string, context?: string) => Promise<string>;
  isProcessing: boolean;
  lastResponse: string | null;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const AIAssistantProvider = ({ children }: { children: React.ReactNode }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  const processQuery = useCallback(async (query: string, context?: string) => {
    setIsProcessing(true);
    try {
      const response = await generateWithAI(query, 'chat');
      setLastResponse(response.result);
      return response.result;
    } catch (error) {
      toast.error('Failed to process query');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <AIAssistantContext.Provider value={{ processQuery, isProcessing, lastResponse }}>
      {children}
    </AIAssistantContext.Provider>
  );
};

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};