import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface AuditLogEntry {
  action: string;
  timestamp: string;
  details: any;
}

interface AuditLogViewerProps {
  auditLog: AuditLogEntry[];
}

export const AuditLogViewer = ({ auditLog }: AuditLogViewerProps) => {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {auditLog?.map((entry, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium capitalize">{entry.action}</h4>
                <p className="text-sm text-neutral-500">
                  {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="text-sm text-neutral-600 font-mono bg-neutral-50 p-2 rounded mt-2">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(entry.details, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};