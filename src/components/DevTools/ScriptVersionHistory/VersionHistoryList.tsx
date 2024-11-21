import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { UserScript } from "@/types/script";
import { formatDistanceToNow } from "date-fns";
import { Eye, RotateCcw, GitCompare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { diffLines } from "diff";

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
  const [selectedVersion, setSelectedVersion] = useState<UserScript | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [diffWithVersion, setDiffWithVersion] = useState<UserScript | null>(null);

  const handleShowDiff = (version: UserScript) => {
    setDiffWithVersion(version);
    setShowDiff(true);
  };

  const renderDiff = () => {
    if (!diffWithVersion || !versions[0]) return null;
    const diff = diffLines(diffWithVersion.content, versions[0].content);

    return (
      <pre className="p-4 bg-neutral-950 text-white rounded-lg overflow-x-auto">
        {diff.map((part, index) => (
          <div
            key={index}
            className={`${
              part.added ? "text-green-400" : part.removed ? "text-red-400" : "text-neutral-300"
            } ${part.added ? "bg-green-950" : part.removed ? "bg-red-950" : ""}`}
          >
            {part.value}
          </div>
        ))}
      </pre>
    );
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`p-4 border rounded-lg ${
                selectedVersion?.id === version.id ? "border-primary" : "border-neutral-200"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Version {version.version}</h4>
                  <p className="text-sm text-neutral-500">
                    {formatDistanceToNow(new Date(version.updated_at || ""), { addSuffix: true })}
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
                    onClick={() => handleShowDiff(version)}
                  >
                    <GitCompare className="w-4 h-4 mr-1" />
                    Compare
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

      <Dialog open={showDiff} onOpenChange={setShowDiff}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Compare Versions</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {renderDiff()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};