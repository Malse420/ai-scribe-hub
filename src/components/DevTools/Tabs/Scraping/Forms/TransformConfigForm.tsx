import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrapingConfig } from "@/utils/scraping";

interface TransformConfigFormProps {
  config: ScrapingConfig;
  onConfigChange: (config: ScrapingConfig) => void;
}

export const TransformConfigForm = ({ config, onConfigChange }: TransformConfigFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Data Transformation</Label>
        <div className="flex items-center gap-2">
          <Select
            value={config.transformation?.type || "map"}
            onValueChange={(value: 'map' | 'filter' | 'reduce') => onConfigChange({
              ...config,
              transformation: { ...config.transformation, type: value }
            })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="map">Map</SelectItem>
              <SelectItem value="filter">Filter</SelectItem>
              <SelectItem value="reduce">Reduce</SelectItem>
            </SelectContent>
          </Select>
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
    </div>
  );
};