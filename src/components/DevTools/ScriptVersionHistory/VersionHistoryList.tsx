import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eye, RotateCcw } from "lucide-react";
import { UserScript } from "@/types/script";

interface VersionHistoryListProps {
  versions: UserScript[];
  onVersionSelect: (version: UserScript) => void;
  onRollback: (version: UserScript) => void;
}

export const VersionHistoryList = ({
  versions,
  onVersionSelect,
  onRollback,
}: VersionHistoryListProps) => {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {versions?.map((version) => (
          <div
            key={version.id}
            className="p-4 border rounded-lg border-neutral-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">Version {version.version}</h4>
                <p className="text-sm text-neutral-500">
                  {formatDistanceToNow(new Date(version.updated_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onVersionSelect(version)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRollback(version)}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Rollback
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};