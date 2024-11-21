import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { ScrapingConfig } from "@/utils/scraping";

interface BasicConfigFormProps {
  config: ScrapingConfig;
  onConfigChange: (config: ScrapingConfig) => void;
}

export const BasicConfigForm = ({ config, onConfigChange }: BasicConfigFormProps) => {
  const addAttribute = () => {
    onConfigChange({
      ...config,
      attributes: [...(config.attributes || []), ""]
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>CSS Selector</Label>
        <Input
          value={config.selector}
          onChange={(e) => onConfigChange({ ...config, selector: e.target.value })}
          placeholder="Enter CSS selector"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Attributes to Extract</Label>
          <Button variant="outline" size="sm" onClick={addAttribute}>
            <Plus className="w-4 h-4 mr-2" />
            Add Attribute
          </Button>
        </div>
        {config.attributes?.map((attr, index) => (
          <Input
            key={index}
            value={attr}
            onChange={(e) => {
              const newAttributes = [...(config.attributes || [])];
              newAttributes[index] = e.target.value;
              onConfigChange({ ...config, attributes: newAttributes });
            }}
            placeholder="Enter attribute name (e.g., href, src)"
          />
        ))}
      </div>
    </div>
  );
};