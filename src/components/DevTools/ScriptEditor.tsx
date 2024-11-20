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

  const handleSave = () => {
    const updatedScript = {
      ...script,
      updated_at: new Date().toISOString(),
    };
    saveScript(updatedScript);
    onSave?.(updatedScript);
    toast.success("Script saved successfully");
  };

  const handleDelete = () => {
    if (script.id) {
      deleteScript(script.id);
      onDelete?.(script.id);
      toast.success("Script deleted successfully");
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setScript((prev) => ({ ...prev, content: value }));
    }
  };

  const handleAddCollaborator = async () => {
    if (!newCollaboratorEmail) {
      toast.error("Please enter an email address");
      return;
    }
    try {
      await addCollaborator.mutateAsync(newCollaboratorEmail);
      setNewCollaboratorEmail("");
      toast.success("Collaborator added successfully");
    } catch (error) {
      toast.error("Failed to add collaborator");
    }
  };

  const handleVersionSelect = (version: UserScript) => {
    setScript(version);
    setShowHistory(false);
    toast.info("Viewing version " + version.version);
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
          handleAddCollaborator={handleAddCollaborator}
          removeCollaborator={removeCollaborator}
          setShowHistory={setShowHistory}
          showHistory={showHistory}
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
            onVersionSelect={handleVersionSelect}
          />
        </div>
      )}
    </div>
  );
};

export default ScriptEditor;