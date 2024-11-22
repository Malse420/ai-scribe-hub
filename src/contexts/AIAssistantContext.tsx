import React, { createContext, useContext, useState, useCallback } from 'react';
import { generateWithAI } from '@/utils/aiModels';
import { toast } from 'sonner';
import { extractPageSource } from '@/utils/sourceExtractor';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  pageContext?: {
    url: string;
    title: string;
    metadata: Record<string, any>;
  };
}

interface AIAssistantContextType {
  processQuery: (query: string, context?: string) => Promise<string>;
  isProcessing: boolean;
  lastResponse: string | null;
  messages: Message[];
  sendMessage: (message: string) => Promise<void>;
  clearHistory: () => void;
  contextMemory: Record<string, any>;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const AIAssistantProvider = ({ children }: { children: React.ReactNode }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contextMemory, setContextMemory] = useState<Record<string, any>>({});

  const getCurrentPageContext = async () => {
    const pageSource = extractPageSource();
    const response = await chrome.runtime.sendMessage({ type: "GET_PAGE_INFO" });
    
    return {
      url: response?.url || window.location.href,
      title: response?.title || document.title,
      metadata: {
        source: pageSource,
        timestamp: Date.now()
      }
    };
  };

  const processQuery = useCallback(async (query: string, context?: string) => {
    setIsProcessing(true);
    try {
      const pageContext = await getCurrentPageContext();
      const response = await generateWithAI(query, 'chat', {
        messages: messages.slice(-10), // Send last 10 messages for context
        pageContext,
        contextMemory
      });
      
      setLastResponse(response.result);
      return response.result;
    } catch (error) {
      toast.error('Failed to process query');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [messages, contextMemory]);

  const sendMessage = useCallback(async (message: string) => {
    const pageContext = await getCurrentPageContext();
    const newMessage: Message = {
      role: 'user',
      content: message,
      timestamp: Date.now(),
      pageContext
    };

    setMessages(prev => [...prev, newMessage]);
    setIsProcessing(true);
    
    try {
      const response = await generateWithAI(message, 'chat', {
        messages: [...messages, newMessage].slice(-10),
        pageContext,
        contextMemory
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.result,
        timestamp: Date.now(),
        pageContext
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLastResponse(response.result);

      // Update context memory with any new information
      setContextMemory(prev => ({
        ...prev,
        [`${pageContext.url}`]: {
          lastVisited: Date.now(),
          title: pageContext.title,
          interactions: (prev[pageContext.url]?.interactions || 0) + 1
        }
      }));
    } catch (error) {
      toast.error('Failed to send message');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [messages, contextMemory]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setContextMemory({});
    setLastResponse(null);
  }, []);

  return (
    <AIAssistantContext.Provider value={{ 
      processQuery, 
      isProcessing, 
      lastResponse,
      messages,
      sendMessage,
      clearHistory,
      contextMemory
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