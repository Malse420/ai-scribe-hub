import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { UserScript } from "@/types/script";
import { saveScript, deleteScript } from "@/utils/scriptGeneration";
import { useScriptCollaboration } from "@/hooks/useScriptCollaboration";
import { editor } from "monaco-editor";
import ScriptVersionHistory from "./ScriptVersionHistory";
import ScriptEditorHeader from "./ScriptEditorHeader";
import ScriptEditorContent from "./ScriptEditorContent";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface ScriptEditorProps {
  initialScript?: UserScript;
  onSave?: (script: UserScript) => void;
  onDelete?: (id: string) => void;
}

const ScriptEditor = ({ initialScript, onSave, onDelete }: ScriptEditorProps) => {
  const [script, setScript] = useState<UserScript>(
    initialScript || {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Script",
      content: "// Write your script here",
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );

  const [showHistory, setShowHistory] = useState(false);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const { collaborators, addCollaborator, removeCollaborator } = useScriptCollaboration(script.id);

  const updatePermissions = useMutation({
    mutationFn: async (permissions: { read: string[]; write: string[]; admin: string[] }) => {
      const { error } = await supabase
        .from("userscripts")
        .update({ permissions })
        .eq("id", script.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Permissions updated successfully");
    },
    onError: () => {
      toast.error("Failed to update permissions");
    },
  });

  const logAuditEvent = async (action: string, details: any) => {
    const { error } = await supabase
      .from("userscripts")
      .update({
        audit_log: [...(script.audit_log || []), {
          action,
          timestamp: new Date().toISOString(),
          details,
        }],
      })
      .eq("id", script.id);

    if (error) {
      console.error("Failed to log audit event:", error);
    }
  };

  const handleSave = async () => {
    const updatedScript = {
      ...script,
      updated_at: new Date().toISOString(),
    };
    await saveScript(updatedScript);
    await logAuditEvent("save", { version: script.version });
    onSave?.(updatedScript);
    toast.success("Script saved successfully");
  };

  const handleDelete = async () => {
    if (script.id) {
      await logAuditEvent("delete", {});
      await deleteScript(script.id);
      onDelete?.(script.id);
      toast.success("Script deleted successfully");
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setScript((prev) => ({ ...prev, content: value }));
    }
  };

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: true },
    fontSize: 14,
    lineNumbers: "on",
    roundedSelection: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <ScriptEditorHeader
          collaborators={collaborators}
          newCollaboratorEmail={newCollaboratorEmail}
          setNewCollaboratorEmail={setNewCollaboratorEmail}
          handleAddCollaborator={addCollaborator}
          removeCollaborator={removeCollaborator}
          setShowHistory={setShowHistory}
          showHistory={showHistory}
          updatePermissions={updatePermissions}
        />
        <ScriptEditorContent
          script={script}
          setScript={setScript}
          handleSave={handleSave}
          handleDelete={handleDelete}
          handleEditorChange={handleEditorChange}
          editorOptions={editorOptions}
        />
      </Card>
      {showHistory && (
        <div className="lg:col-span-1">
          <ScriptVersionHistory
            scriptId={script.id}
            onVersionSelect={(version) => {
              setScript(version);
              setShowHistory(false);
              toast.info("Viewing version " + version.version);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ScriptEditor;