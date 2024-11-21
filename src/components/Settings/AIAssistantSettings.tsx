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
            value={settings.defaultModel || "gpt-4o-mini"}
            onValueChange={(value) => handleChange("defaultModel", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">OpenAI GPT-4 Optimized (Best Quality)</SelectItem>
              <SelectItem value="gpt-4o-mini">OpenAI GPT-4 Mini (Fast)</SelectItem>
              <SelectItem value="claude-3-opus">Anthropic Claude 3 Opus</SelectItem>
              <SelectItem value="claude-3-sonnet">Anthropic Claude 3 Sonnet</SelectItem>
              <SelectItem value="claude-3-haiku">Anthropic Claude 3 Haiku</SelectItem>
              <SelectItem value="gemini-pro">Google Gemini Pro</SelectItem>
              <SelectItem value="gemini-pro-vision">Google Gemini Pro Vision</SelectItem>
              <SelectItem value="mixtral-8x7b">Mistral Mixtral 8x7B</SelectItem>
              <SelectItem value="mistral-medium">Mistral Medium</SelectItem>
              <SelectItem value="mistral-small">Mistral Small</SelectItem>
              <SelectItem value="llama-2-70b">Meta Llama 2 70B</SelectItem>
              <SelectItem value="llama-2-13b">Meta Llama 2 13B</SelectItem>
              <SelectItem value="codellama-34b">Meta CodeLlama 34B</SelectItem>
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