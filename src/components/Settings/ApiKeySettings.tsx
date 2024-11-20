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
import { Save } from "lucide-react";

const ApiKeySettings = () => {
  const [keys, setKeys] = useState({
    openai: localStorage.getItem("openai_key") || "",
    anthropic: localStorage.getItem("anthropic_key") || "",
    google: localStorage.getItem("google_key") || "",
  });

  const handleSave = () => {
    Object.entries(keys).forEach(([provider, key]) => {
      if (key) {
        localStorage.setItem(`${provider}_key`, key);
      } else {
        localStorage.removeItem(`${provider}_key`);
      }
    });
    toast.success("API keys saved successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI API Keys</CardTitle>
        <CardDescription>
          Manage your API keys for different AI services. Keys are stored locally
          and never sent to our servers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">OpenAI API Key</label>
          <Input
            type="password"
            value={keys.openai}
            onChange={(e) =>
              setKeys((prev) => ({ ...prev, openai: e.target.value }))
            }
            placeholder="sk-..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Anthropic API Key</label>
          <Input
            type="password"
            value={keys.anthropic}
            onChange={(e) =>
              setKeys((prev) => ({ ...prev, anthropic: e.target.value }))
            }
            placeholder="sk-ant-..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Google AI API Key</label>
          <Input
            type="password"
            value={keys.google}
            onChange={(e) =>
              setKeys((prev) => ({ ...prev, google: e.target.value }))
            }
            placeholder="AIza..."
          />
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