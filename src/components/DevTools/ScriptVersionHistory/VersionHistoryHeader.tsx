import { CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export const VersionHistoryHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <History className="w-5 h-5" />
        Version History
      </CardTitle>
    </CardHeader>
  );
};