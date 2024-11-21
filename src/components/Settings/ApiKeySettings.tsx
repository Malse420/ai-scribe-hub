import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Trash } from "lucide-react";
import { useApiKeys } from "@/hooks/useApiKeys";

const ApiKeySettings = () => {
  const { apiKeys, isLoading, addApiKey, updateApiKey, deleteApiKey } = useApiKeys();
  const [newKeys, setNewKeys] = useState({
    openai: "",
    anthropic: "",
    google: "",
    huggingface: "",
  });

  const handleSave = async () => {
    try {
      for (const [service, key] of Object.entries(newKeys)) {
        if (!key) continue;

        const existingKey = apiKeys?.find(k => k.api_service === service);
        
        if (existingKey) {
          await updateApiKey.mutateAsync({
            id: existingKey.id,
            api_key: key,
          });
        } else {
          await addApiKey.mutateAsync({
            api_service: service,
            api_key: key,
          });
        }
      }
      toast.success("API keys saved successfully");
    } catch (error) {
      console.error('Failed to save API keys:', error);
      toast.error("Failed to save API keys");
    }
  };

  const handleDelete = async (service: string) => {
    const key = apiKeys?.find(k => k.api_service === service);
    if (key) {
      await deleteApiKey.mutateAsync(key.id);
      setNewKeys(prev => ({ ...prev, [service]: "" }));
      toast.success(`${service} API key deleted`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI API Keys</CardTitle>
        <CardDescription>
          Manage your API keys for different AI services. Keys are stored securely
          in your Supabase database.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">OpenAI API Key</label>
          <div className="flex gap-2">
            <Input
              type="password"
              value={newKeys.openai}
              onChange={(e) =>
                setNewKeys((prev) => ({ ...prev, openai: e.target.value }))
              }
              placeholder="sk-..."
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete('openai')}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Anthropic API Key</label>
          <div className="flex gap-2">
            <Input
              type="password"
              value={newKeys.anthropic}
              onChange={(e) =>
                setNewKeys((prev) => ({ ...prev, anthropic: e.target.value }))
              }
              placeholder="sk-ant-..."
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete('anthropic')}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Google AI API Key</label>
          <div className="flex gap-2">
            <Input
              type="password"
              value={newKeys.google}
              onChange={(e) =>
                setNewKeys((prev) => ({ ...prev, google: e.target.value }))
              }
              placeholder="AIza..."
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete('google')}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Hugging Face API Key</label>
          <div className="flex gap-2">
            <Input
              type="password"
              value={newKeys.huggingface}
              onChange={(e) =>
                setNewKeys((prev) => ({ ...prev, huggingface: e.target.value }))
              }
              placeholder="hf_..."
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete('huggingface')}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save API Keys
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApiKeySettings;