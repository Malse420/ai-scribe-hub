import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrapingConfig } from "@/utils/webScraping";
import { Plus, Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ScrapeConfigFormProps {
  config: ScrapingConfig;
  onConfigChange: (config: ScrapingConfig) => void;
}

export const ScrapeConfigForm = ({ config, onConfigChange }: ScrapeConfigFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");

  const addAttribute = () => {
    onConfigChange({
      ...config,
      attributes: [...(config.attributes || []), ""]
    });
  };

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
    <Card className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="transform">Transform</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="transform" className="space-y-4">
          <div className="space-y-2">
            <Label>Data Transformation</Label>
            <div className="flex items-center gap-2">
              <select
                value={config.transformation?.type || "map"}
                onChange={(e) => onConfigChange({
                  ...config,
                  transformation: { ...config.transformation, type: e.target.value as any }
                })}
                className="border rounded p-2"
              >
                <option value="map">Map</option>
                <option value="filter">Filter</option>
                <option value="reduce">Reduce</option>
              </select>
              <Textarea
                value={config.transformation?.function}
                onChange={(e) => onConfigChange({
                  ...config,
                  transformation: { ...config.transformation, function: e.target.value }
                })}
                placeholder="JavaScript transformation function"
                className="flex-1"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};