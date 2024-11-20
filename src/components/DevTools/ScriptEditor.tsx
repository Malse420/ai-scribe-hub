import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Play, Trash, UserPlus, Users } from "lucide-react";
import { UserScript, saveScript, deleteScript } from "@/utils/scriptGeneration";
import { useScriptCollaboration } from "@/hooks/useScriptCollaboration";
import Editor from "@monaco-editor/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ScriptEditorProps {
  initialScript?: UserScript;
  onSave?: (script: UserScript) => void;
  onDelete?: (id: string) => void;
}

const ScriptEditor = ({ initialScript, onSave, onDelete }: ScriptEditorProps) => {
  const [script, setScript] = useState<UserScript>(
    initialScript || {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Script",
      description: "",
      code: "// Write your script here",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    }
  );

  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const { collaborators, addCollaborator, removeCollaborator } = useScriptCollaboration(script.id);

  const handleSave = () => {
    const updatedScript = {
      ...script,
      modified: new Date().toISOString(),
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
      setScript((prev) => ({ ...prev, code: value }));
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

  const editorOptions = {
    minimap: { enabled: true },
    fontSize: 14,
    lineNumbers: "on",
    roundedSelection: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Script Editor</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Collaborators ({collaborators.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Collaborators</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Collaborator email"
                    value={newCollaboratorEmail}
                    onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  />
                  <Button onClick={handleAddCollaborator} size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {collaborators.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span>{collaborator.email}</span>
                        <Badge variant={collaborator.online ? "secondary" : "outline"}>
                          {collaborator.online ? "Online" : "Offline"}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCollaborator.mutateAsync(collaborator.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={script.name}
          onChange={(e) => setScript({ ...script, name: e.target.value })}
          placeholder="Script name"
          className="mb-2"
        />
        <div className="h-[500px] border rounded-lg overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={script.code}
            onChange={handleEditorChange}
            options={editorOptions}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleDelete}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptEditor;