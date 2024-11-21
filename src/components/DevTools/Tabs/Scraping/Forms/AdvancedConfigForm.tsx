import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Wand2 } from "lucide-react";
import { ScrapingConfig } from "@/utils/scraping/types";
import { toast } from "sonner";

interface AdvancedConfigFormProps {
  config: ScrapingConfig;
  onConfigChange: (config: ScrapingConfig) => void;
}

export const AdvancedConfigForm = ({ config, onConfigChange }: AdvancedConfigFormProps) => {
  const addDynamicSelector = () => {
    onConfigChange({
      ...config,
      dynamicSelectors: {
        parentSelector: config.selector,
        childSelectors: [
          ...(config.dynamicSelectors?.childSelectors || []),
          { name: "", selector: "", attribute: "" }
        ]
      }
    });
    toast.success("Added new dynamic selector");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Rate Limiting</Label>
          <Switch
            checked={config.rateLimit?.enabled}
            onCheckedChange={(enabled) => 
              onConfigChange({
                ...config,
                rateLimit: { ...config.rateLimit, enabled }
              })
            }
          />
        </div>
        
        {config.rateLimit?.enabled && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Requests per minute</Label>
              <Input
                type="number"
                min="1"
                value={config.rateLimit?.requestsPerMinute}
                onChange={(e) => onConfigChange({
                  ...config,
                  rateLimit: { 
                    ...config.rateLimit,
                    requestsPerMinute: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <Label>Delay (ms)</Label>
              <Input
                type="number"
                min="0"
                value={config.rateLimit?.delayBetweenRequests}
                onChange={(e) => onConfigChange({
                  ...config,
                  rateLimit: {
                    ...config.rateLimit,
                    delayBetweenRequests: parseInt(e.target.value)
                  }
                })}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Recursive Scraping</Label>
          <Switch
            checked={config.recursive?.enabled}
            onCheckedChange={(enabled) => 
              onConfigChange({
                ...config,
                recursive: { ...config.recursive, enabled }
              })
            }
          />
        </div>
        
        {config.recursive?.enabled && (
          <div className="space-y-4">
            <div>
              <Label>Child Selector</Label>
              <Input
                value={config.recursive?.childSelector}
                onChange={(e) => onConfigChange({
                  ...config,
                  recursive: {
                    ...config.recursive,
                    childSelector: e.target.value
                  }
                })}
                placeholder="CSS selector for child elements"
              />
            </div>
            <div>
              <Label>Max Depth</Label>
              <Input
                type="number"
                min="1"
                value={config.recursive?.maxDepth}
                onChange={(e) => onConfigChange({
                  ...config,
                  recursive: {
                    ...config.recursive,
                    maxDepth: parseInt(e.target.value)
                  }
                })}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Retry Configuration</Label>
          <Switch
            checked={config.retry?.enabled}
            onCheckedChange={(enabled) => 
              onConfigChange({
                ...config,
                retry: { ...config.retry, enabled }
              })
            }
          />
        </div>
        
        {config.retry?.enabled && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Max Retries</Label>
              <Input
                type="number"
                min="1"
                value={config.retry?.maxRetries}
                onChange={(e) => onConfigChange({
                  ...config,
                  retry: {
                    ...config.retry,
                    maxRetries: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <Label>Initial Delay (ms)</Label>
              <Input
                type="number"
                min="0"
                value={config.retry?.initialDelay}
                onChange={(e) => onConfigChange({
                  ...config,
                  retry: {
                    ...config.retry,
                    initialDelay: parseInt(e.target.value)
                  }
                })}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Dynamic Selectors</Label>
          <Button variant="outline" size="sm" onClick={addDynamicSelector}>
            <Wand2 className="w-4 h-4 mr-2" />
            Add Dynamic Selector
          </Button>
        </div>
        {config.dynamicSelectors?.childSelectors.map((selector, index) => (
          <div key={index} className="grid grid-cols-3 gap-2">
            <Input
              value={selector.name}
              onChange={(e) => {
                const newSelectors = [...(config.dynamicSelectors?.childSelectors || [])];
                newSelectors[index] = { ...selector, name: e.target.value };
                onConfigChange({
                  ...config,
                  dynamicSelectors: { ...config.dynamicSelectors, childSelectors: newSelectors }
                });
              }}
              placeholder="Field name"
            />
            <Input
              value={selector.selector}
              onChange={(e) => {
                const newSelectors = [...(config.dynamicSelectors?.childSelectors || [])];
                newSelectors[index] = { ...selector, selector: e.target.value };
                onConfigChange({
                  ...config,
                  dynamicSelectors: { ...config.dynamicSelectors, childSelectors: newSelectors }
                });
              }}
              placeholder="CSS selector"
            />
            <Input
              value={selector.attribute}
              onChange={(e) => {
                const newSelectors = [...(config.dynamicSelectors?.childSelectors || [])];
                newSelectors[index] = { ...selector, attribute: e.target.value };
                onConfigChange({
                  ...config,
                  dynamicSelectors: { ...config.dynamicSelectors, childSelectors: newSelectors }
                });
              }}
              placeholder="Attribute (optional)"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
