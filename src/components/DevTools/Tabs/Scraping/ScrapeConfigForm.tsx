import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrapingConfig } from "@/utils/webScraping";
import { Plus } from "lucide-react";

interface ScrapeConfigFormProps {
  config: ScrapingConfig;
  onConfigChange: (config: ScrapingConfig) => void;
}

export const ScrapeConfigForm = ({ config, onConfigChange }: ScrapeConfigFormProps) => {
  const addAttribute = () => {
    onConfigChange({
      ...config,
      attributes: [...(config.attributes || []), ""]
    });
  };

  const addFilter = () => {
    onConfigChange({
      ...config,
      filters: [...(config.filters || []), { field: "", operator: "equals", value: "" }]
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">CSS Selector</label>
        <Input
          value={config.selector}
          onChange={(e) => onConfigChange({ ...config, selector: e.target.value })}
          placeholder="Enter CSS selector"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Attributes to Extract</label>
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

      <div className="space-y-2">
        <label className="block text-sm font-medium">Pagination</label>
        <div className="flex gap-2">
          <Input
            value={config.pagination?.nextButton}
            onChange={(e) => onConfigChange({
              ...config,
              pagination: { ...config.pagination, nextButton: e.target.value }
            })}
            placeholder="Next button selector"
          />
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
        </div>
      </div>
    </Card>
  );
};