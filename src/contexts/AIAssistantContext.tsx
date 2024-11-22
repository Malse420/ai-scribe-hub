import React, { createContext, useContext, useState, useCallback } from 'react';
import { generateWithAI } from '@/utils/aiModels';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantContextType {
  processQuery: (query: string, context?: string) => Promise<string>;
  isProcessing: boolean;
  lastResponse: string | null;
  messages: Message[];
  sendMessage: (message: string) => Promise<void>;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const AIAssistantProvider = ({ children }: { children: React.ReactNode }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

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

  const sendMessage = useCallback(async (message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsProcessing(true);
    
    try {
      const response = await generateWithAI(message, 'chat');
      setMessages(prev => [...prev, { role: 'assistant', content: response.result }]);
      setLastResponse(response.result);
    } catch (error) {
      toast.error('Failed to send message');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <AIAssistantContext.Provider value={{ 
      processQuery, 
      isProcessing, 
      lastResponse,
      messages,
      sendMessage 
    }}>
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