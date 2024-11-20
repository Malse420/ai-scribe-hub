import { Database, HardDrive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StorageIndicatorProps {
  isOnline: boolean;
  storageType: "local" | "hybrid" | "cloud";
}

const StorageIndicator = ({ isOnline, storageType }: StorageIndicatorProps) => {
  const getStatusColor = () => {
    if (!isOnline) return "bg-destructive";
    return storageType === "local" ? "bg-yellow-500" : "bg-green-500";
  };

  const getStatusText = () => {
    if (!isOnline) return "Offline";
    switch (storageType) {
      case "local":
        return "Local Storage";
      case "hybrid":
        return "Hybrid Storage";
      case "cloud":
        return "Cloud Storage";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="secondary" className="gap-2">
            {storageType === "local" ? (
              <HardDrive className="w-4 h-4" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            <div className="flex items-center gap-2">
              {getStatusText()}
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor()}`}
              />
            </div>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isOnline
              ? "Connected to Supabase"
              : "Working in offline mode"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StorageIndicator;