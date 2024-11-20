import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, RotateCcw, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UserScript } from "@/types/script";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ScriptVersionHistoryProps {
  scriptId: string;
  onVersionSelect: (version: UserScript) => void;
}

const ScriptVersionHistory = ({ scriptId, onVersionSelect }: ScriptVersionHistoryProps) => {
  const queryClient = useQueryClient();
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const { data: versions } = useQuery({
    queryKey: ['script-versions', scriptId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('userscripts')
        .select('*')
        .eq('parent_version_id', scriptId)
        .order('version', { ascending: false });

      if (error) throw error;
      return data as UserScript[];
    },
  });

  const rollbackMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const version = versions?.find(v => v.id === versionId);
      if (!version) throw new Error('Version not found');

      const { error } = await supabase
        .from('userscripts')
        .update({
          content: version.content,
          version: version.version,
          updated_at: new Date().toISOString(),
        })
        .eq('id', scriptId);

      if (error) throw error;
      return version;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['script-versions', scriptId] });
      toast.success('Successfully rolled back to selected version');
    },
    onError: () => {
      toast.error('Failed to roll back to selected version');
    },
  });

  const handleRollback = (versionId: string) => {
    rollbackMutation.mutateAsync(versionId);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {versions?.map((version) => (
              <div
                key={version.id}
                className={`p-4 border rounded-lg ${
                  selectedVersion === version.id ? 'border-primary' : 'border-neutral-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">Version {version.version}</h4>
                    <p className="text-sm text-neutral-500">
                      {formatDistanceToNow(new Date(version.updated_at || ''), { addSuffix: true })}
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
                      onClick={() => handleRollback(version.id)}
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
      </CardContent>
    </Card>
  );
};

export default ScriptVersionHistory;