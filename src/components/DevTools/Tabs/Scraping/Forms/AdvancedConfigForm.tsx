import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import { ScrapingConfig } from "@/utils/scraping";

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
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Pagination</Label>
        <Input
          value={config.pagination?.nextButton}
          onChange={(e) => onConfigChange({
            ...config,
            pagination: { ...config.pagination, nextButton: e.target.value }
          })}
          placeholder="Next button selector"
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            min="1"
            value={config.pagination?.maxPages}
            onChange={(e) => onConfigChange({
              ...config,
              pagination: { ...config.pagination, maxPages: parseInt(e.target.value) }
            })}
            placeholder="Max pages"
          />
          <Input
            type="number"
            min="0"
            value={config.pagination?.waitTime}
            onChange={(e) => onConfigChange({
              ...config,
              pagination: { ...config.pagination, waitTime: parseInt(e.target.value) }
            })}
            placeholder="Wait time (ms)"
          />
        </div>
        <Textarea
          value={config.pagination?.stopCondition}
          onChange={(e) => onConfigChange({
            ...config,
            pagination: { ...config.pagination, stopCondition: e.target.value }
          })}
          placeholder="Stop condition (JavaScript expression)"
        />
      </div>

      <div className="space-y-2">
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