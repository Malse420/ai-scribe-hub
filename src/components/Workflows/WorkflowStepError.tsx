import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface WorkflowStepErrorProps {
  error: Error;
  onRetry: () => void;
  retryCount: number;
  maxRetries: number;
}

export const WorkflowStepError = ({
  error,
  onRetry,
  retryCount,
  maxRetries,
}: WorkflowStepErrorProps) => {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error in workflow step</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm">{error.message}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm">
            Retry attempt {retryCount} of {maxRetries}
          </span>
          {retryCount < maxRetries && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry Step
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};