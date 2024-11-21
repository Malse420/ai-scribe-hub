import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useAIAssistant } from "@/contexts/AIAssistantContext";

export const AIAssistantTab = () => {
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const { sendMessage, messages, isProcessing } = useAIAssistant();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await sendMessage(input);
      setInput("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <Card key={index} className={`p-4 ${
              message.role === 'user' ? 'bg-primary/10 ml-12' : 'bg-secondary/10 mr-12'
            }`}>
              <div className="flex items-start gap-3">
                {message.role === 'assistant' && <Bot className="w-6 h-6" />}
                <div className="flex-1">
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about web scraping..."
            className="flex-1"
            rows={3}
          />
          <Button type="submit" disabled={isProcessing || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};