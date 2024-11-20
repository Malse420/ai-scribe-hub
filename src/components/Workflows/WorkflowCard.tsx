import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, PauseCircle } from "lucide-react";

interface WorkflowCardProps {
  workflow: {
    id: string;
    name: string;
    status: string;
    workflow_steps: Array<{
      id: string;
      step_type: string;
    }>;
  };
}

export const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {workflow.name}
        </CardTitle>
        {workflow.status === "active" ? (
          <PlayCircle className="h-4 w-4 text-green-500" />
        ) : (
          <PauseCircle className="h-4 w-4 text-yellow-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {workflow.workflow_steps.map((step) => (
            <Badge key={step.id} variant="secondary">
              {step.step_type}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};