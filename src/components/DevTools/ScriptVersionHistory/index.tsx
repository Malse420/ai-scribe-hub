import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VersionHistoryHeader } from "./VersionHistoryHeader";
import { VersionHistoryList } from "./VersionHistoryList";
import { AuditLogViewer } from "./AuditLogViewer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { UserScript } from "@/types/script";
import { toast } from "sonner";

interface ScriptVersionHistoryProps {
  scriptId: string;
  onVersionSelect: (version: UserScript) => void;
}

const ScriptVersionHistory = ({
  scriptId,
  onVersionSelect,
}: ScriptVersionHistoryProps) => {
  const [showAuditLog, setShowAuditLog] = useState(false);
  const queryClient = useQueryClient();

  const { data: versions } = useQuery({
    queryKey: ["script-versions", scriptId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("userscripts")
        .select("*")
        .eq("parent_version_id", scriptId)
        .order("version", { ascending: false });

      if (error) throw error;
      return data as UserScript[];
    },
  });

  const { data: auditLog } = useQuery({
    queryKey: ["script-audit-log", scriptId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("userscripts")
        .select("audit_log")
        .eq("id", scriptId)
        .single();

      if (error) throw error;
      return data.audit_log || [];
    },
  });

  const rollbackMutation = useMutation({
    mutationFn: async (version: UserScript) => {
      const { error } = await supabase
        .from("userscripts")
        .update({
          content: version.content,
          version: version.version,
          updated_at: new Date().toISOString(),
        })
        .eq("id", scriptId);

      if (error) throw error;
      return version;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["script-versions", scriptId] });
      toast.success("Successfully rolled back to selected version");
    },
    onError: () => {
      toast.error("Failed to roll back to selected version");
    },
  });

  return (
    <Card className="h-full">
      <VersionHistoryHeader 
        showAuditLog={showAuditLog}
        setShowAuditLog={setShowAuditLog}
      />
      <CardContent>
        {showAuditLog ? (
          <AuditLogViewer auditLog={auditLog || []} />
        ) : (
          <VersionHistoryList
            versions={versions || []}
            onVersionSelect={onVersionSelect}
            onRollback={(version) => rollbackMutation.mutate(version)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ScriptVersionHistory;