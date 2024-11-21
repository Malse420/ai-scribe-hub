import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface WorkflowStep {
  id: string;
  step_type: string;
  step_config: any;
  visual_position: { x: number; y: number };
  connections: string[];
}

export const VisualWorkflowEditor = ({ workflowId }: { workflowId: string }) => {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const { data: workflowSteps } = useQuery({
    queryKey: ["workflow-steps", workflowId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflow_steps")
        .select("*")
        .eq("workflow_id", workflowId)
        .order("step_order", { ascending: true });

      if (error) throw error;
      return data as WorkflowStep[];
    },
  });

  const updateStepPosition = useMutation({
    mutationFn: async ({ stepId, position }: { stepId: string; position: { x: number; y: number } }) => {
      const { error } = await supabase
        .from("workflow_steps")
        .update({ visual_position: position })
        .eq("id", stepId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Step position updated");
    },
    onError: () => {
      toast.error("Failed to update step position");
    },
  });

  const handleDragStep = useCallback((stepId: string, position: { x: number; y: number }) => {
    updateStepPosition.mutate({ stepId, position });
  }, []);

  return (
    <Card className="p-4 h-[600px] relative">
      <div className="flex justify-between mb-4">
        <Button onClick={() => setSteps([...steps, { 
          id: Math.random().toString(),
          step_type: "new",
          step_config: {},
          visual_position: { x: 100, y: 100 },
          connections: []
        }])}>
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
        <Button onClick={() => toast.success("Workflow saved")}>
          <Save className="w-4 h-4 mr-2" />
          Save Workflow
        </Button>
      </div>

      <div className="relative h-full border rounded-lg">
        {workflowSteps?.map((step) => (
          <div
            key={step.id}
            className={`absolute p-4 border rounded-lg bg-white cursor-move ${
              selectedStep === step.id ? "border-primary" : "border-gray-200"
            }`}
            style={{
              left: step.visual_position.x,
              top: step.visual_position.y,
            }}
            onClick={() => setSelectedStep(step.id)}
            draggable
            onDragEnd={(e) => {
              const rect = e.currentTarget.parentElement?.getBoundingClientRect();
              if (rect) {
                handleDragStep(step.id, {
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }
            }}
          >
            <h3 className="font-medium">{step.step_type}</h3>
          </div>
        ))}
      </div>
    </Card>
  );
};