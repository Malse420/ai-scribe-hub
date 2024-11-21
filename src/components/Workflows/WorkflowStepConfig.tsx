import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Settings } from "lucide-react";
import { toast } from "sonner";

interface WorkflowStepConfigProps {
  stepId: string;
  config: {
    retries: number;
    backoff: "linear" | "exponential";
    conditions: Array<{
      field: string;
      operator: string;
      value: string;
    }>;
  };
  onUpdate: (config: any) => void;
}

export const WorkflowStepConfig = ({ stepId, config, onUpdate }: WorkflowStepConfigProps) => {
  const [retries, setRetries] = useState(config.retries || 0);
  const [backoff, setBackoff] = useState(config.backoff || "linear");
  const [conditions, setConditions] = useState(config.conditions || []);

  const handleSave = () => {
    onUpdate({
      ...config,
      retries,
      backoff,
      conditions,
    });
    toast.success("Step configuration updated");
  };

  const addCondition = () => {
    setConditions([...conditions, { field: "", operator: "equals", value: "" }]);
  };

  const updateCondition = (index: number, field: string, value: string) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Step Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Retry Attempts</label>
            <Input
              type="number"
              min="0"
              max="10"
              value={retries}
              onChange={(e) => setRetries(parseInt(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Backoff Strategy</label>
            <Select value={backoff} onValueChange={setBackoff}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="exponential">Exponential</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Conditions</label>
              <Button variant="outline" size="sm" onClick={addCondition}>
                Add Condition
              </Button>
            </div>
            {conditions.map((condition, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  placeholder="Field"
                  value={condition.field}
                  onChange={(e) => updateCondition(index, "field", e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={condition.operator}
                  onValueChange={(value) => updateCondition(index, "operator", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="startsWith">Starts with</SelectItem>
                    <SelectItem value="endsWith">Ends with</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Value"
                  value={condition.value}
                  onChange={(e) => updateCondition(index, "value", e.target.value)}
                  className="flex-1"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Configuration</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};