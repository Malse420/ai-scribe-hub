import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Clock } from "lucide-react";

interface VersionHistoryHeaderProps {
  showAuditLog: boolean;
  setShowAuditLog: (show: boolean) => void;
}

export const VersionHistoryHeader = ({
  showAuditLog,
  setShowAuditLog,
}: VersionHistoryHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <History className="w-5 h-5" />
        {showAuditLog ? "Audit Log" : "Version History"}
      </CardTitle>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowAuditLog(!showAuditLog)}
      >
        <Clock className="w-4 h-4 mr-1" />
        {showAuditLog ? "Show Versions" : "Show Audit Log"}
      </Button>
    </CardHeader>
  );
};