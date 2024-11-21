import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { ScrapingConfig } from "@/utils/webScraping";

interface FilterConfigProps {
  config: ScrapingConfig;
  onConfigChange: (config: ScrapingConfig) => void;
}

export const FilterConfig = ({ config, onConfigChange }: FilterConfigProps) => {
  const addFilter = () => {
    onConfigChange({
      ...config,
      filters: [...(config.filters || []), { field: "", operator: "equals", value: "" }]
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Filters</label>
        <Button variant="outline" size="sm" onClick={addFilter}>
          <Filter className="w-4 h-4 mr-2" />
          Add Filter
        </Button>
      </div>
      {config.filters?.map((filter, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={filter.field}
            onChange={(e) => {
              const newFilters = [...(config.filters || [])];
              newFilters[index] = { ...filter, field: e.target.value };
              onConfigChange({ ...config, filters: newFilters });
            }}
            placeholder="Field name"
          />
          <Select
            value={filter.operator}
            onValueChange={(value: "equals" | "contains" | "greater" | "less") => {
              const newFilters = [...(config.filters || [])];
              newFilters[index] = { ...filter, operator: value };
              onConfigChange({ ...config, filters: newFilters });
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equals">Equals</SelectItem>
              <SelectItem value="contains">Contains</SelectItem>
              <SelectItem value="greater">Greater than</SelectItem>
              <SelectItem value="less">Less than</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={filter.value}
            onChange={(e) => {
              const newFilters = [...(config.filters || [])];
              newFilters[index] = { ...filter, value: e.target.value };
              onConfigChange({ ...config, filters: newFilters });
            }}
            placeholder="Value"
          />
        </div>
      ))}
    </div>
  );
};