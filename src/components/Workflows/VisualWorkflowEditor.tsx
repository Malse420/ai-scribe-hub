import { useState, useCallback, useRef, useEffect } from "react";
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

interface Connection {
  from: string;
  to: string;
}

export const VisualWorkflowEditor = ({ workflowId }: { workflowId: string }) => {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const drawConnections = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#8B5CF6";
    ctx.lineWidth = 2;

    connections.forEach(({ from, to }) => {
      const fromStep = workflowSteps?.find(step => step.id === from);
      const toStep = workflowSteps?.find(step => step.id === to);

      if (fromStep && toStep) {
        const fromPos = fromStep.visual_position;
        const toPos = toStep.visual_position;

        ctx.beginPath();
        ctx.moveTo(fromPos.x + 100, fromPos.y + 30);
        ctx.bezierCurveTo(
          fromPos.x + 150, fromPos.y + 30,
          toPos.x - 50, toPos.y + 30,
          toPos.x, toPos.y + 30
        );
        ctx.stroke();
      }
    });
  }, [connections, workflowSteps]);

  useEffect(() => {
    drawConnections();
    
    // Add resize listener to handle canvas resizing
    const handleResize = () => {
      drawConnections();
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawConnections]);

  const handleDragStep = useCallback((stepId: string, position: { x: number; y: number }) => {
    updateStepPosition.mutate({ stepId, position });
    drawConnections();
  }, [updateStepPosition, drawConnections]);

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

      <div className="relative h-full border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
        />
        
        {workflowSteps?.map((step) => (
          <div
            key={step.id}
            className={`absolute p-4 border rounded-lg bg-white cursor-move ${
              selectedStep === step.id ? "border-primary" : "border-gray-200"
            }`}
            style={{
              left: step.visual_position.x,
              top: step.visual_position.y,
              zIndex: selectedStep === step.id ? 10 : 1,
            }}
            onClick={() => setSelectedStep(step.id)}
            onMouseDown={(e) => {
              setIsDragging(true);
              setDragStart({
                x: e.clientX - step.visual_position.x,
                y: e.clientY - step.visual_position.y,
              });
            }}
            onMouseMove={(e) => {
              if (isDragging && dragStart) {
                const newX = e.clientX - dragStart.x;
                const newY = e.clientY - dragStart.y;
                handleDragStep(step.id, { x: newX, y: newY });
              }
            }}
            onMouseUp={() => {
              setIsDragging(false);
              setDragStart(null);
            }}
          >
            <h3 className="font-medium">{step.step_type}</h3>
          </div>
        ))}
      </div>
    </Card>
  );
};