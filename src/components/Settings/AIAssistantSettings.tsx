import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getAIAssistantSettings, saveAIAssistantSettings } from "@/utils/aiAssistantSettings";

const AIAssistantSettings = () => {
  const [settings, setSettings] = useState(getAIAssistantSettings());

  const handleChange = (field: string, value: string | boolean) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    saveAIAssistantSettings(newSettings);
    toast.success("AI Assistant settings updated");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assistant Settings</CardTitle>
        <CardDescription>
          Configure how the AI assistant processes and responds to your requests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="defaultModel">Default AI Model</Label>
          <Select
            value={settings.defaultModel || "gpt-4o"}
            onValueChange={(value) => handleChange("defaultModel", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">OpenAI GPT-4o (Most Powerful)</SelectItem>
              <SelectItem value="o1-preview">OpenAI O1-Preview (Advanced)</SelectItem>
              <SelectItem value="o1-mini">OpenAI O1-Mini (Fast)</SelectItem>
              
              <SelectItem value="gemini-1.5-pro">Google Gemini 1.5 Pro (Advanced)</SelectItem>
              <SelectItem value="gemini-1.0-ultra">Google Gemini 1.0 Ultra (Powerful)</SelectItem>
              <SelectItem value="gemini-1.0">Google Gemini 1.0 (Fast)</SelectItem>
              
              <SelectItem value="claude-3.5-sonnet">Anthropic Claude 3.5 Sonnet (Balanced)</SelectItem>
              <SelectItem value="claude-3.5-haiku">Anthropic Claude 3.5 Haiku (Fast)</SelectItem>
              <SelectItem value="claude-3.0-opus">Anthropic Claude 3.0 Opus (Powerful)</SelectItem>
              
              <SelectItem value="meta-llama-3.1-70b">Meta Llama 3.1 70B Instruct (Most Powerful)</SelectItem>
              <SelectItem value="nvidia-llama-3.1-70b">NVIDIA Llama 3.1 Nemotron 70B (Advanced)</SelectItem>
              <SelectItem value="llama-3.2-11b-vision">Meta Llama 3.2 11B Vision (Vision-capable)</SelectItem>
              <SelectItem value="hermes-3-llama-3.1-8b">Nous Hermes 3 Llama 3.1 8B (Fast)</SelectItem>
              <SelectItem value="mistral-nemo-2407">Mistral Nemo Instruct 2407 (Balanced)</SelectItem>
              <SelectItem value="phi-3.5-mini">Microsoft Phi 3.5 Mini (Efficient)</SelectItem>
              <SelectItem value="qwen-2.5-7b">Qwen 2.5 7B (Fast)</SelectItem>
              <SelectItem value="qwen-2.5-14b">Qwen 2.5 14B (Balanced)</SelectItem>
              <SelectItem value="qwen-2.5-32b">Qwen 2.5 32B (Advanced)</SelectItem>
              <SelectItem value="qwen-2.5-72b">Qwen 2.5 72B (Most Powerful)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="systemPrompt">System Prompt</Label>
          <Textarea
            id="systemPrompt"
            value={settings.systemPrompt}
            onChange={(e) => handleChange("systemPrompt", e.target.value)}
            placeholder="Enter a system prompt for the AI assistant..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="includeHtmlSource">Include HTML Source</Label>
            <Switch
              id="includeHtmlSource"
              checked={settings.includeHtmlSource}
              onCheckedChange={(checked) => handleChange("includeHtmlSource", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="includeInlineScripts">Include Inline Scripts</Label>
            <Switch
              id="includeInlineScripts"
              checked={settings.includeInlineScripts}
              onCheckedChange={(checked) => handleChange("includeInlineScripts", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="includeExternalScripts">Include External Scripts</Label>
            <Switch
              id="includeExternalScripts"
              checked={settings.includeExternalScripts}
              onCheckedChange={(checked) => handleChange("includeExternalScripts", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="includePageMetadata">Include Page Metadata</Label>
            <Switch
              id="includePageMetadata"
              checked={settings.includePageMetadata}
              onCheckedChange={(checked) => handleChange("includePageMetadata", checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistantSettings;