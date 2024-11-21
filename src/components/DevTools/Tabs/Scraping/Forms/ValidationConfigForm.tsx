import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrapingConfig } from "@/utils/scraping";

interface ValidationConfigFormProps {
  config: ScrapingConfig;
  onConfigChange: (config: ScrapingConfig) => void;
}

export const ValidationConfigForm = ({ config, onConfigChange }: ValidationConfigFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Required Fields</Label>
        <Input
          value={config.validation?.required?.join(", ")}
          onChange={(e) => onConfigChange({
            ...config,
            validation: {
              ...config.validation,
              required: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
            }
          })}
          placeholder="Comma-separated field names"
        />
      </div>

      <div className="space-y-2">
        <Label>Custom Validation</Label>
        <Textarea
          value={config.validation?.custom}
          onChange={(e) => onConfigChange({
            ...config,
            validation: { ...config.validation, custom: e.target.value }
          })}
          placeholder="JavaScript validation function"
        />
      </div>
    </div>
  );
};